import { PortfolioService } from '@ghostfolio/api/app/portfolio/portfolio.service';
import { ExchangeRateDataService } from '@ghostfolio/api/services/exchange-rate-data/exchange-rate-data.service';
import { MarketDataService } from '@ghostfolio/api/services/market-data/market-data.service';
import { SymbolProfileService } from '@ghostfolio/api/services/symbol-profile/symbol-profile.service';
import { DEFAULT_CURRENCY } from '@ghostfolio/common/config';
import type {
  PortfolioOptimizerRequest,
  PortfolioOptimizerResponse
} from '@ghostfolio/common/interfaces';

import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from '@prisma/client';
import { format, subDays } from 'date-fns';

import { annualizeMeanCov } from '../black-litterman.service';
import {
  PricePoint,
  alignPrices,
  baselineWeights,
  buildViews,
  optimize,
  portfolioReturns,
  runBacktest,
  simpleReturns
} from './optimizer.engine';
import { efficientFrontier, portfolioMetrics } from './optimizer.math';

const MAX_ASSETS = 20;
const MIN_ASSETS = 2;
const MIN_OBSERVATIONS = 60;
const REBALANCE_DAYS = { MONTHLY: 21, QUARTERLY: 63, YEARLY: 252 };
const METHOD_LABELS = {
  BLACK_LITTERMAN: 'Black-Litterman',
  MAX_SHARPE: 'Markowitz: Sharpe tối đa',
  MEAN_VARIANCE: 'Markowitz: trung bình-phương sai',
  MIN_CVAR: 'CVaR tối thiểu',
  MIN_VARIANCE: 'Markowitz: phương sai tối thiểu',
  RISK_PARITY: 'Cân bằng rủi ro (Risk Parity)'
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

@Injectable()
export class OptimizerService {
  public constructor(
    private readonly exchangeRateDataService: ExchangeRateDataService,
    private readonly marketDataService: MarketDataService,
    private readonly portfolioService: PortfolioService,
    private readonly symbolProfileService: SymbolProfileService
  ) {}

  public async optimize({
    baseCurrency = DEFAULT_CURRENCY,
    request,
    userId
  }: {
    baseCurrency?: string;
    request: PortfolioOptimizerRequest;
    userId: string;
  }): Promise<PortfolioOptimizerResponse> {
    const warnings: string[] = [];
    const identifiers = this.uniqueAssets(request.assets ?? []);

    if (identifiers.length < MIN_ASSETS) {
      throw new BadRequestException(
        `Cần chọn ít nhất ${MIN_ASSETS} tài sản để tối ưu hóa`
      );
    }

    if (identifiers.length > MAX_ASSETS) {
      throw new BadRequestException(
        `Chỉ hỗ trợ tối đa ${MAX_ASSETS} tài sản mỗi lần tối ưu hóa`
      );
    }

    const lookbackDays = clamp(request.lookbackDays ?? 730, 90, 3650);
    const riskFreeRate = clamp(request.riskFreeRate ?? 0, -0.05, 0.5);
    const cvarAlpha = clamp(request.cvarAlpha ?? 0.95, 0.8, 0.99);
    const tau = clamp(request.tau ?? 0.05, 0.001, 1);
    const maxWeight = clamp(request.maxWeight ?? 1, 1 / identifiers.length, 1);

    if (
      (request.maxWeight ?? 1) < 1 / identifiers.length - 1e-9 &&
      request.maxWeight !== undefined
    ) {
      warnings.push(
        `Tỷ trọng tối đa đã được nâng lên ${(100 / identifiers.length).toFixed(1)}% để bài toán có nghiệm.`
      );
    }

    const [profiles, holdings] = await Promise.all([
      this.symbolProfileService.getSymbolProfiles(identifiers),
      this.portfolioService.getDetails({ userId, withSummary: false })
    ]);

    const nameOf = new Map(
      profiles.map((profile) => [
        profile.symbol,
        profile.name ?? profile.symbol
      ])
    );
    const holdingValue = new Map<string, number>();

    for (const holding of holdings.holdings) {
      holdingValue.set(
        holding.assetProfile.symbol,
        holding.valueInBaseCurrency ?? 0
      );
    }

    const to = new Date();
    const from = subDays(to, lookbackDays);
    const marketData = await this.marketDataService.getRange({
      assetProfileIdentifiers: identifiers,
      dateQuery: { gte: from }
    });

    // Convert every price series into the user's base currency so that
    // assets quoted in different currencies are comparable
    const currencyOf = new Map(
      profiles.map((profile) => [profile.symbol, profile.currency])
    );
    const foreignCurrencies = Array.from(
      new Set(
        identifiers
          .map(({ symbol }) => currencyOf.get(symbol))
          .filter((currency) => currency && currency !== baseCurrency)
      )
    ) as string[];
    const exchangeRates =
      foreignCurrencies.length > 0
        ? await this.exchangeRateDataService.getExchangeRatesByCurrency({
            currencies: foreignCurrencies,
            startDate: from,
            targetCurrency: baseCurrency
          })
        : {};

    const seriesBySymbol = new Map<string, PricePoint[]>(
      identifiers.map(({ symbol }) => [symbol, []])
    );

    for (const item of marketData) {
      if (item.marketPrice > 0) {
        const date = format(item.date, 'yyyy-MM-dd');
        const currency = currencyOf.get(item.symbol);
        const rate =
          currency && currency !== baseCurrency
            ? exchangeRates[`${currency}${baseCurrency}`]?.[date]
            : 1;

        if (rate && Number.isFinite(rate)) {
          seriesBySymbol.get(item.symbol)?.push({
            date,
            price: item.marketPrice * rate
          });
        }
      }
    }

    const withoutData = identifiers.filter(
      ({ symbol }) => (seriesBySymbol.get(symbol)?.length ?? 0) < 2
    );

    if (withoutData.length > 0) {
      throw new BadRequestException(
        `Không có dữ liệu giá lịch sử cho: ${withoutData
          .map(({ symbol }) => symbol)
          .join(', ')}. Hãy bỏ các mã này hoặc thu thập dữ liệu giá trước.`
      );
    }

    const symbols = identifiers.map(({ symbol }) => symbol);
    const { dates, prices } = alignPrices(
      symbols.map((symbol) => seriesBySymbol.get(symbol) ?? [])
    );
    const returns = simpleReturns(prices);

    if (returns.length < MIN_OBSERVATIONS) {
      throw new BadRequestException(
        `Chỉ có ${returns.length} quan sát chung giữa các tài sản đã chọn, cần ít nhất ${MIN_OBSERVATIONS}. Hãy tăng khoảng thời gian hoặc bỏ tài sản có lịch sử ngắn.`
      );
    }

    if (returns.length < 250) {
      warnings.push(
        `Chỉ có ${returns.length} quan sát chung, ước lượng lợi suất và hiệp phương sai sẽ nhiễu.`
      );
    }

    const heldValues = symbols.map((symbol) => holdingValue.get(symbol) ?? 0);
    const heldTotal = heldValues.reduce((a, b) => a + b, 0);
    const currentWeights =
      heldTotal > 0
        ? heldValues.map((value) => value / heldTotal)
        : new Array(symbols.length).fill(1 / symbols.length);

    if (heldTotal === 0) {
      warnings.push(
        'Các tài sản đã chọn chưa có trong danh mục của bạn: danh mục hiện tại được coi là chia đều.'
      );
    }

    const views = buildViews(symbols, request.views ?? []);

    if (request.method !== 'BLACK_LITTERMAN' && views.length > 0) {
      warnings.push(
        'Quan điểm (views) chỉ được dùng với phương pháp Black-Litterman.'
      );
    }

    const optimizeOptions = {
      cvarAlpha,
      maxWeight,
      riskAversion:
        request.riskAversion !== undefined
          ? clamp(request.riskAversion, 0.1, 50)
          : undefined,
      riskFreeRate,
      tau,
      views
    };

    const chosen = optimize({
      ...optimizeOptions,
      marketWeights: currentWeights,
      method: request.method,
      returns
    });

    const { mu, sigma } = annualizeMeanCov(returns, 252);
    const baselines = baselineWeights(returns);
    const referenceMethods = [
      'MIN_VARIANCE',
      'MAX_SHARPE',
      'MIN_CVAR'
    ] as const;
    const referenceWeights = referenceMethods.map((method) =>
      method === request.method
        ? chosen.weights
        : optimize({
            ...optimizeOptions,
            marketWeights: currentWeights,
            method,
            returns
          }).weights
    );

    const portfolios = [
      { key: 'CURRENT', label: 'Danh mục hiện tại', weights: currentWeights },
      { key: 'EQUAL', label: 'Chia đều (1/N)', weights: baselines.equal },
      {
        key: 'INVERSE_VOLATILITY',
        label: 'Nghịch đảo biến động',
        weights: baselines.inverseVolatility
      },
      {
        key: 'RISK_PARITY',
        label: 'Cân bằng rủi ro',
        weights: baselines.riskParity
      },
      ...referenceMethods.map((method, i) => ({
        key: method,
        label: METHOD_LABELS[method],
        weights: referenceWeights[i]
      })),
      {
        key: 'OPTIMIZED',
        label: `Kết quả: ${METHOD_LABELS[request.method]}`,
        weights: chosen.weights
      }
    ].map((portfolio) => ({
      ...portfolio,
      metrics: portfolioMetrics(
        portfolioReturns(returns, portfolio.weights),
        riskFreeRate
      )
    }));

    const frontier = efficientFrontier(mu, sigma, maxWeight, 25).map(
      ({ expectedReturn, volatility }) => ({ expectedReturn, volatility })
    );

    let backtest: PortfolioOptimizerResponse['backtest'];

    if (request.backtest) {
      const lookback = clamp(request.backtestLookbackDays ?? 252, 60, 1000);
      const rebalanceEvery =
        REBALANCE_DAYS[request.backtestRebalance ?? 'QUARTERLY'];
      const result = runBacktest({
        currentWeights,
        dates,
        lookback,
        method: request.method,
        optimizeOptions,
        prices,
        rebalanceEvery
      });

      if (result) {
        backtest = { ...result, lookbackDays: lookback };
      } else {
        warnings.push(
          'Không đủ lịch sử để backtest: cần thêm dữ liệu hoặc giảm cửa sổ ước lượng.'
        );
      }
    }

    return {
      asOf: new Date().toISOString(),
      baseCurrency,
      assets: identifiers.map(({ dataSource, symbol }, i) => ({
        annualReturn: mu[i],
        annualVolatility: Math.sqrt(sigma[i][i]),
        currentWeight: currentWeights[i],
        dataSource,
        isHolding: heldValues[i] > 0,
        name: nameOf.get(symbol) ?? symbol,
        optimizedWeight: chosen.weights[i],
        symbol
      })),
      backtest,
      blackLitterman: chosen.blackLitterman,
      frontier,
      from: dates[0],
      method: request.method,
      observations: returns.length,
      portfolios,
      to: dates[dates.length - 1],
      warnings
    };
  }

  private uniqueAssets(assets: PortfolioOptimizerRequest['assets']) {
    const seen = new Set<string>();

    return assets
      .filter(({ dataSource, symbol }) => {
        const key = `${dataSource}:${symbol}`;

        if (!symbol || !(dataSource in DataSource) || seen.has(key)) {
          return false;
        }

        seen.add(key);

        return true;
      })
      .map(({ dataSource, symbol }) => ({
        dataSource: dataSource as DataSource,
        symbol
      }));
  }
}
