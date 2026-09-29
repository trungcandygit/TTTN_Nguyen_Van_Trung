import type {
  PortfolioOptimizerAssetInput,
  PortfolioOptimizerMethod,
  PortfolioOptimizerRebalance,
  PortfolioOptimizerRequest,
  PortfolioOptimizerViewInput
} from '@ghostfolio/common/interfaces';

export const METHOD_OPTIONS: {
  description: string;
  label: string;
  value: PortfolioOptimizerMethod;
}[] = [
  {
    description:
      'Chọn tỷ trọng làm tỷ lệ lợi suất vượt lãi suất phi rủi ro trên rủi ro (Sharpe) cao nhất trên đường biên hiệu quả (Markowitz, 1952).',
    label: 'Markowitz: Sharpe tối đa',
    value: 'MAX_SHARPE'
  },
  {
    description:
      'Chọn danh mục có phương sai thấp nhất, không phụ thuộc vào dự báo lợi suất (Markowitz, 1952).',
    label: 'Markowitz: phương sai tối thiểu',
    value: 'MIN_VARIANCE'
  },
  {
    description:
      'Tối đa hóa lợi suất kỳ vọng trừ phạt rủi ro theo hệ số ngại rủi ro (trung bình-phương sai).',
    label: 'Markowitz: trung bình-phương sai',
    value: 'MEAN_VARIANCE'
  },
  {
    description:
      'Giảm thiểu tổn thất trung bình trong các phiên tệ nhất (CVaR, Rockafellar và Uryasev, 2000), phù hợp phân phối lợi suất lệch và đuôi dày.',
    label: 'CVaR tối thiểu',
    value: 'MIN_CVAR'
  },
  {
    description:
      'Kết hợp cân bằng thị trường (danh mục hiện tại) với quan điểm của bạn, có độ tin cậy cho từng quan điểm (Black và Litterman, 1992).',
    label: 'Black-Litterman',
    value: 'BLACK_LITTERMAN'
  },
  {
    description:
      'Mỗi tài sản đóng góp rủi ro bằng nhau vào danh mục, không cần dự báo lợi suất.',
    label: 'Cân bằng rủi ro (Risk Parity)',
    value: 'RISK_PARITY'
  }
];

export const LOOKBACK_OPTIONS = [
  { days: 365, label: '1 năm' },
  { days: 730, label: '2 năm' },
  { days: 1095, label: '3 năm' },
  { days: 1825, label: '5 năm' }
];

export const REBALANCE_OPTIONS: {
  label: string;
  value: PortfolioOptimizerRebalance;
}[] = [
  { label: 'Hàng tháng', value: 'MONTHLY' },
  { label: 'Hàng quý', value: 'QUARTERLY' },
  { label: 'Hàng năm', value: 'YEARLY' }
];

export interface ViewForm {
  confidencePercent: number;
  expectedReturnPercent: number;
  symbol: string;
  type: 'ABSOLUTE' | 'RELATIVE';
  versusSymbol?: string;
}

export interface OptimizerForm {
  assets: PortfolioOptimizerAssetInput[];
  backtest: boolean;
  backtestLookbackDays: number;
  backtestRebalance: PortfolioOptimizerRebalance;
  cvarAlphaPercent: number;
  lookbackDays: number;
  maxWeightPercent: number;
  method: PortfolioOptimizerMethod;
  riskAversion: number;
  riskFreeRatePercent: number;
  tauPercent: number;
  views: ViewForm[];
}

/** Converts the form (percent units) into the API request (fractions). */
export function buildOptimizerRequest(
  form: OptimizerForm
): PortfolioOptimizerRequest {
  const request: PortfolioOptimizerRequest = {
    assets: form.assets,
    backtest: form.backtest,
    backtestLookbackDays: form.backtestLookbackDays,
    backtestRebalance: form.backtestRebalance,
    cvarAlpha: form.cvarAlphaPercent / 100,
    lookbackDays: form.lookbackDays,
    maxWeight: form.maxWeightPercent / 100,
    method: form.method,
    riskAversion: form.riskAversion,
    riskFreeRate: form.riskFreeRatePercent / 100,
    tau: form.tauPercent / 100
  };

  if (form.method === 'BLACK_LITTERMAN') {
    request.views = form.views
      .filter(
        (view) =>
          view.symbol &&
          Number.isFinite(view.expectedReturnPercent) &&
          (view.type === 'ABSOLUTE' ||
            (view.versusSymbol && view.versusSymbol !== view.symbol))
      )
      .map((view): PortfolioOptimizerViewInput => ({
        confidence: view.confidencePercent / 100,
        expectedReturn: view.expectedReturnPercent / 100,
        symbol: view.symbol,
        type: view.type,
        versusSymbol: view.type === 'RELATIVE' ? view.versusSymbol : undefined
      }));
  }

  return request;
}

/** Returns a Vietnamese message for the first invalid form value, or null. */
export function validateOptimizerForm(form: OptimizerForm): string | null {
  if (form.assets.length < 2) {
    return 'Hãy chọn ít nhất 2 tài sản.';
  }

  if (form.assets.length > 20) {
    return 'Chỉ chọn tối đa 20 tài sản.';
  }

  if (form.maxWeightPercent < 100 / form.assets.length) {
    return `Tỷ trọng tối đa phải từ ${(100 / form.assets.length).toFixed(1)}% trở lên khi chọn ${form.assets.length} tài sản.`;
  }

  if (form.maxWeightPercent > 100) {
    return 'Tỷ trọng tối đa không được vượt quá 100%.';
  }

  return null;
}
