import type {
  PortfolioOptimizerMethod,
  PortfolioOptimizerMetrics,
  PortfolioOptimizerViewInput
} from '@ghostfolio/common/interfaces';

import {
  Matrix,
  annualizeMeanCov,
  defaultOmega,
  impliedEquilibriumReturns,
  impliedRiskAversion,
  posteriorReturns,
  scaleMatrix
} from '../black-litterman.service';
import {
  equalWeights,
  inverseVolatilityWeights,
  maximizeSharpe,
  maximizeUtility,
  minimizeCVaR,
  minimizeVariance,
  portfolioMetrics,
  portfolioVariance,
  projectToCappedSimplex,
  riskParityWeights
} from './optimizer.math';

const TRADING_DAYS_PER_YEAR = 252;
const DEFAULT_RISK_AVERSION = 2.5;

export interface PricePoint {
  date: string;
  price: number;
}

export interface ResolvedView {
  confidence: number;
  p: number[];
  q: number;
}

export interface OptimizeOptions {
  cvarAlpha: number;
  maxWeight: number;
  riskAversion?: number;
  riskFreeRate: number;
  tau: number;
  views: ResolvedView[];
}

export interface OptimizeInputs extends OptimizeOptions {
  marketWeights: number[];
  method: PortfolioOptimizerMethod;
  /** Periodic simple returns, rows = periods, columns = assets */
  returns: Matrix;
}

export interface OptimizeResult {
  blackLitterman?: {
    delta: number;
    impliedReturns: number[];
    posteriorReturns: number[];
    tau: number;
  };
  weights: number[];
}

/**
 * Aligns several price series on the union of their dates. Missing prices are
 * forward filled and the table starts on the first date where every asset has
 * a price, so no look-ahead data is introduced.
 */
export function alignPrices(seriesList: PricePoint[][]): {
  dates: string[];
  prices: Matrix;
} {
  if (seriesList.length === 0 || seriesList.some((s) => s.length === 0)) {
    return { dates: [], prices: [] };
  }

  const start = seriesList
    .map((series) =>
      series.reduce((min, p) => (p.date < min ? p.date : min), '9999')
    )
    .reduce((max, date) => (date > max ? date : max), '');

  const dates = Array.from(
    new Set(seriesList.flatMap((series) => series.map(({ date }) => date)))
  )
    .filter((date) => date >= start)
    .sort();

  const maps = seriesList.map(
    (series) => new Map(series.map(({ date, price }) => [date, price]))
  );
  const last: number[] = seriesList.map((series) => {
    const first = [...series].sort((a, b) => (a.date < b.date ? -1 : 1))[0];

    return first.price;
  });

  const prices = dates.map((date) =>
    maps.map((map, i) => {
      const value = map.get(date);

      if (value !== undefined && Number.isFinite(value) && value > 0) {
        last[i] = value;
      }

      return last[i];
    })
  );

  return { dates, prices };
}

export function simpleReturns(prices: Matrix): Matrix {
  const result: Matrix = [];

  for (let t = 1; t < prices.length; t++) {
    result.push(prices[t].map((price, i) => price / prices[t - 1][i] - 1));
  }

  return result;
}

/** Turns user views into pick matrix rows; invalid views are dropped. */
export function buildViews(
  symbols: string[],
  views: PortfolioOptimizerViewInput[]
): ResolvedView[] {
  const result: ResolvedView[] = [];

  for (const view of views ?? []) {
    const index = symbols.indexOf(view.symbol);

    if (index < 0 || !Number.isFinite(view.expectedReturn)) {
      continue;
    }

    const p = new Array(symbols.length).fill(0);
    p[index] = 1;

    if (view.type === 'RELATIVE') {
      const other = symbols.indexOf(view.versusSymbol ?? '');

      if (other < 0 || other === index) {
        continue;
      }

      p[other] = -1;
    }

    result.push({
      confidence: Math.min(0.95, Math.max(0.05, view.confidence ?? 0.5)),
      p,
      q: view.expectedReturn
    });
  }

  return result;
}

function marketRiskAversion(
  mu: number[],
  sigma: Matrix,
  weights: number[],
  riskFreeRate: number
) {
  const marketReturn = mu.reduce((s, m, i) => s + m * weights[i], 0);
  const variance = portfolioVariance(weights, sigma);
  const implied = impliedRiskAversion(marketReturn, variance, riskFreeRate);

  // Implied delta from a short noisy sample is unstable, keep it sensible
  return implied > 0
    ? Math.min(10, Math.max(1, implied))
    : DEFAULT_RISK_AVERSION;
}

/**
 * Black-Litterman posterior returns with view confidences (Omega scaled as
 * tau * P Sigma P' * (1 - c) / c, so c = 0.5 gives the He-Litterman default)
 * followed by a long-only, capped mean-variance optimization on the posterior.
 */
function blackLittermanWeights(
  sigma: Matrix,
  inputs: OptimizeInputs,
  delta: number
): OptimizeResult {
  const { marketWeights, maxWeight, tau, views } = inputs;
  const pi = impliedEquilibriumReturns(sigma, marketWeights, delta);

  let posterior = pi;
  let posteriorCov = scaleMatrix(sigma, tau);

  if (views.length > 0) {
    const p = views.map((view) => view.p);
    const q = views.map((view) => view.q);
    const baseOmega = defaultOmega(tau, p, sigma);
    const omega = baseOmega.map((row, i) =>
      row.map((value, j) =>
        i === j
          ? Math.max(
              value * ((1 - views[i].confidence) / views[i].confidence),
              1e-10
            )
          : 0
      )
    );

    const { eR, mInv } = posteriorReturns({
      delta,
      omega,
      p,
      q,
      sigma,
      tau,
      wMkt: marketWeights
    });

    posterior = eR;
    posteriorCov = mInv;
  }

  const totalCov = sigma.map((row, i) =>
    row.map((value, j) => value + posteriorCov[i][j])
  );
  const start = projectToCappedSimplex(marketWeights, maxWeight);
  const weights = maximizeUtility(posterior, totalCov, delta, maxWeight, start);

  return {
    blackLitterman: {
      delta,
      impliedReturns: pi,
      posteriorReturns: posterior,
      tau
    },
    weights
  };
}

export function optimize(inputs: OptimizeInputs): OptimizeResult {
  const { cvarAlpha, maxWeight, method, returns, riskFreeRate } = inputs;
  const { mu, sigma } = annualizeMeanCov(returns, TRADING_DAYS_PER_YEAR);
  const delta =
    inputs.riskAversion ??
    marketRiskAversion(mu, sigma, inputs.marketWeights, riskFreeRate);

  switch (method) {
    case 'BLACK_LITTERMAN':
      return blackLittermanWeights(sigma, inputs, delta);
    case 'MAX_SHARPE':
      return {
        weights: maximizeSharpe(mu, sigma, riskFreeRate, maxWeight).weights
      };
    case 'MEAN_VARIANCE':
      return { weights: maximizeUtility(mu, sigma, delta, maxWeight) };
    case 'MIN_CVAR':
      return { weights: minimizeCVaR(returns, cvarAlpha, maxWeight) };
    case 'MIN_VARIANCE':
      return { weights: minimizeVariance(sigma, maxWeight) };
    case 'RISK_PARITY':
      return { weights: riskParityWeights(sigma) };
  }
}

export function baselineWeights(returns: Matrix) {
  const { sigma } = annualizeMeanCov(returns, TRADING_DAYS_PER_YEAR);

  return {
    equal: equalWeights(sigma.length),
    inverseVolatility: inverseVolatilityWeights(sigma),
    riskParity: riskParityWeights(sigma)
  };
}

/** Daily portfolio returns for constant weights rebalanced every period. */
export function portfolioReturns(returns: Matrix, weights: number[]) {
  return returns.map((row) => row.reduce((s, r, i) => s + r * weights[i], 0));
}

export interface BacktestInput {
  currentWeights: number[];
  dates: string[];
  lookback: number;
  method: PortfolioOptimizerMethod;
  optimizeOptions: OptimizeOptions;
  prices: Matrix;
  rebalanceEvery: number;
}

export interface BacktestOutput {
  dates: string[];
  metrics: { key: string; label: string; metrics: PortfolioOptimizerMetrics }[];
  rebalanceEveryDays: number;
  rebalances: number;
  series: { key: string; label: string; values: number[] }[];
}

const MAX_REBALANCES = 30;

/**
 * Walk-forward backtest: at each rebalance date the weights are estimated
 * only from the previous `lookback` returns, then held (drifting) until the
 * next rebalance. Baselines are rebalanced on the same dates.
 */
export function runBacktest(input: BacktestInput): BacktestOutput | null {
  const { currentWeights, dates, lookback, method, prices } = input;
  const returns = simpleReturns(prices);
  const n = currentWeights.length;
  const outOfSample = returns.length - lookback;

  if (outOfSample < 20 || lookback < 30) {
    return null;
  }

  const step = Math.max(
    input.rebalanceEvery,
    Math.ceil(outOfSample / MAX_REBALANCES)
  );

  const strategies: { key: string; label: string; w: number[] }[] = [
    { key: 'OPTIMIZED', label: 'Danh mục tối ưu', w: currentWeights },
    { key: 'EQUAL', label: 'Chia đều', w: equalWeights(n) },
    { key: 'CURRENT', label: 'Danh mục hiện tại', w: currentWeights }
  ];

  const equity = strategies.map(() => [100]);
  const periodReturns = strategies.map(() => [] as number[]);
  const state = strategies.map(({ w }) => [...w]);
  let rebalances = 0;

  for (let t = lookback; t < returns.length; t++) {
    if ((t - lookback) % step === 0) {
      const window = returns.slice(t - lookback, t);

      state[0] = optimize({
        ...input.optimizeOptions,
        marketWeights: currentWeights,
        method,
        returns: window
      }).weights;
      state[1] = equalWeights(n);
      state[2] = [...currentWeights];
      rebalances++;
    }

    strategies.forEach((_, s) => {
      const w = state[s];
      const r = returns[t].reduce((acc, value, i) => acc + value * w[i], 0);
      const growth = 1 + r;

      periodReturns[s].push(r);
      equity[s].push(equity[s][equity[s].length - 1] * growth);

      // Drift: weights follow relative asset performance until rebalanced
      const next = w.map(
        (weight, i) => (weight * (1 + returns[t][i])) / growth
      );

      state[s] = next;
    });
  }

  return {
    dates: dates.slice(lookback),
    metrics: strategies.map(({ key, label }, s) => ({
      key,
      label,
      metrics: portfolioMetrics(
        periodReturns[s],
        input.optimizeOptions.riskFreeRate
      )
    })),
    rebalanceEveryDays: step,
    rebalances,
    series: strategies.map(({ key, label }, s) => ({
      key,
      label,
      values: equity[s]
    }))
  };
}
