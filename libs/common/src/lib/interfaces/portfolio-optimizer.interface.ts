export type PortfolioOptimizerMethod =
  | 'BLACK_LITTERMAN'
  | 'MAX_SHARPE'
  | 'MEAN_VARIANCE'
  | 'MIN_CVAR'
  | 'MIN_VARIANCE'
  | 'RISK_PARITY';

export type PortfolioOptimizerRebalance = 'MONTHLY' | 'QUARTERLY' | 'YEARLY';

export interface PortfolioOptimizerAssetInput {
  dataSource: string;
  symbol: string;
}

export interface PortfolioOptimizerViewInput {
  /** Confidence in the view between 0.05 and 0.95 */
  confidence: number;
  /** Annual expected return (ABSOLUTE) or outperformance (RELATIVE), e.g. 0.12 */
  expectedReturn: number;
  symbol: string;
  type: 'ABSOLUTE' | 'RELATIVE';
  /** Required for RELATIVE views: the asset that is outperformed */
  versusSymbol?: string;
}

export interface PortfolioOptimizerRequest {
  assets: PortfolioOptimizerAssetInput[];
  backtest?: boolean;
  backtestLookbackDays?: number;
  backtestRebalance?: PortfolioOptimizerRebalance;
  cvarAlpha?: number;
  lookbackDays?: number;
  maxWeight?: number;
  method: PortfolioOptimizerMethod;
  /** Risk aversion (delta) for MEAN_VARIANCE and BLACK_LITTERMAN */
  riskAversion?: number;
  riskFreeRate?: number;
  /** Black-Litterman prior uncertainty (tau) */
  tau?: number;
  views?: PortfolioOptimizerViewInput[];
}

export interface PortfolioOptimizerMetrics {
  annualReturn: number;
  annualVolatility: number;
  cvar95: number;
  maxDrawdown: number;
  sharpe: number;
  totalReturn: number;
}

export interface PortfolioOptimizerAsset {
  annualReturn: number;
  annualVolatility: number;
  currentWeight: number;
  dataSource: string;
  isHolding: boolean;
  name: string;
  optimizedWeight: number;
  symbol: string;
}

export interface PortfolioOptimizerPortfolio {
  key: string;
  label: string;
  metrics: PortfolioOptimizerMetrics;
  weights: number[];
}

export interface PortfolioOptimizerBacktest {
  dates: string[];
  lookbackDays: number;
  metrics: { key: string; label: string; metrics: PortfolioOptimizerMetrics }[];
  rebalanceEveryDays: number;
  rebalances: number;
  series: { key: string; label: string; values: number[] }[];
}

export interface PortfolioOptimizerResponse {
  asOf: string;
  assets: PortfolioOptimizerAsset[];
  backtest?: PortfolioOptimizerBacktest;
  baseCurrency: string;
  blackLitterman?: {
    delta: number;
    impliedReturns: number[];
    posteriorReturns: number[];
    tau: number;
  };
  frontier: { expectedReturn: number; volatility: number }[];
  from: string;
  method: PortfolioOptimizerMethod;
  observations: number;
  portfolios: PortfolioOptimizerPortfolio[];
  to: string;
  warnings: string[];
}
