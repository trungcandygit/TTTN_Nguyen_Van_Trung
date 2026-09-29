import {
  Matrix,
  annualizeMeanCov,
  matVecMul
} from '../black-litterman.service';

/**
 * Portfolio optimization algorithms (long-only, weights sum to 1, optional
 * maximum weight per asset). Dependency-free; n (number of assets) is small.
 *
 *  - Markowitz (1952): minimum variance, mean-variance utility, maximum Sharpe
 *    ratio (tangency portfolio) and the efficient frontier.
 *  - CVaR (Rockafellar & Uryasev, 2000): minimum Conditional Value-at-Risk on
 *    historical scenarios, solved with a projected subgradient method.
 *  - Baselines: equal weights, inverse volatility, risk parity (equal risk
 *    contribution, cyclical coordinate descent of Griveau-Billion et al.).
 */

const TRADING_DAYS_PER_YEAR = 252;

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);
const dot = (a: number[], b: number[]) =>
  a.reduce((acc, value, i) => acc + value * b[i], 0);

export function equalWeights(n: number): number[] {
  return new Array(n).fill(1 / n);
}

export function portfolioVariance(w: number[], sigma: Matrix): number {
  return dot(w, matVecMul(sigma, w));
}

export function portfolioReturn(w: number[], mu: number[]): number {
  return dot(w, mu);
}

/**
 * Euclidean projection onto {w : sum(w) = 1, 0 <= w_i <= cap}. The cap is
 * raised to 1/n when it would make the problem infeasible.
 */
export function projectToCappedSimplex(v: number[], cap: number): number[] {
  const n = v.length;
  const upper = Math.max(cap, 1 / n);
  const clipAt = (tau: number) =>
    v.map((value) => Math.min(upper, Math.max(0, value - tau)));

  let low = Math.min(...v) - upper;
  let high = Math.max(...v);

  for (let iteration = 0; iteration < 200; iteration++) {
    const mid = (low + high) / 2;

    if (sum(clipAt(mid)) > 1) {
      low = mid;
    } else {
      high = mid;
    }
  }

  return clipAt((low + high) / 2);
}

export function inverseVolatilityWeights(sigma: Matrix): number[] {
  const inverse = sigma.map((row, i) => 1 / Math.sqrt(Math.max(row[i], 1e-18)));
  const total = sum(inverse);

  return inverse.map((value) => value / total);
}

/** Equal risk contribution portfolio (long-only, uncapped). */
export function riskParityWeights(sigma: Matrix): number[] {
  const n = sigma.length;
  const budget = 1 / n;
  let w = inverseVolatilityWeights(sigma);

  for (let sweep = 0; sweep < 1000; sweep++) {
    let change = 0;

    for (let i = 0; i < n; i++) {
      const a = Math.max(sigma[i][i], 1e-18);
      let b = 0;

      for (let j = 0; j < n; j++) {
        if (j !== i) {
          b += sigma[i][j] * w[j];
        }
      }

      const next = (-b + Math.sqrt(b * b + 4 * a * budget)) / (2 * a);

      change = Math.max(change, Math.abs(next - w[i]));
      w[i] = next;
    }

    if (change < 1e-14) {
      break;
    }
  }

  const total = sum(w);

  w = w.map((value) => value / total);

  return w;
}

function maxEigenvalue(a: Matrix): number {
  let v = new Array(a.length).fill(1);
  let eigenvalue = 0;

  for (let iteration = 0; iteration < 200; iteration++) {
    const next = matVecMul(a, v);
    const norm = Math.sqrt(dot(next, next));

    if (norm < 1e-300) {
      return 0;
    }

    v = next.map((value) => value / norm);
    eigenvalue = norm;
  }

  return eigenvalue;
}

/**
 * min 0.5 x'Ax - b'x over the capped simplex (A positive semi-definite),
 * accelerated projected gradient (FISTA).
 */
function minimizeQuadratic(
  a: Matrix,
  b: number[],
  cap: number,
  start?: number[]
): number[] {
  const n = b.length;
  const step = 1 / Math.max(maxEigenvalue(a), 1e-12);
  let x = projectToCappedSimplex(start ?? equalWeights(n), cap);
  let y = x;
  let t = 1;

  for (let iteration = 0; iteration < 5000; iteration++) {
    const gradient = matVecMul(a, y).map((value, i) => value - b[i]);
    const next = projectToCappedSimplex(
      y.map((value, i) => value - step * gradient[i]),
      cap
    );
    const tNext = (1 + Math.sqrt(1 + 4 * t * t)) / 2;

    y = next.map((value, i) => value + ((t - 1) / tNext) * (value - x[i]));

    const change = Math.max(...next.map((value, i) => Math.abs(value - x[i])));

    x = next;
    t = tNext;

    if (change < 1e-13) {
      break;
    }
  }

  return x;
}

export function minimizeVariance(sigma: Matrix, cap: number): number[] {
  const a = sigma.map((row) => row.map((value) => 2 * value));

  return minimizeQuadratic(a, new Array(sigma.length).fill(0), cap);
}

/** max mu'w - (gamma / 2) w'Sigma w  (mean-variance utility). */
export function maximizeUtility(
  mu: number[],
  sigma: Matrix,
  gamma: number,
  cap: number,
  start?: number[]
): number[] {
  const a = sigma.map((row) => row.map((value) => gamma * value));

  return minimizeQuadratic(a, mu, cap, start);
}

function sharpeOf(w: number[], mu: number[], sigma: Matrix, rf: number) {
  const variance = portfolioVariance(w, sigma);

  return variance > 1e-18
    ? (portfolioReturn(w, mu) - rf) / Math.sqrt(variance)
    : Number.NEGATIVE_INFINITY;
}

/**
 * Maximum Sharpe ratio (tangency) portfolio. The Sharpe ratio along the
 * mean-variance frontier is unimodal in the risk aversion gamma, so a golden
 * section search over log(gamma) finds the optimum.
 */
export function maximizeSharpe(
  mu: number[],
  sigma: Matrix,
  rf: number,
  cap: number
): { gamma: number; sharpe: number; weights: number[] } {
  if (Math.max(...mu) - rf <= 0) {
    // No asset beats the risk-free rate: the best choice is minimum risk
    const weights = minimizeVariance(sigma, cap);

    return {
      gamma: Infinity,
      sharpe: sharpeOf(weights, mu, sigma, rf),
      weights
    };
  }

  const evaluate = (logGamma: number) => {
    const weights = maximizeUtility(mu, sigma, Math.pow(10, logGamma), cap);

    return { logGamma, sharpe: sharpeOf(weights, mu, sigma, rf), weights };
  };

  const phi = (Math.sqrt(5) - 1) / 2;
  let low = -3;
  let high = 6;
  let c = high - phi * (high - low);
  let d = low + phi * (high - low);
  let fc = evaluate(c);
  let fd = evaluate(d);

  for (let iteration = 0; iteration < 40; iteration++) {
    if (fc.sharpe > fd.sharpe) {
      high = d;
      d = c;
      fd = fc;
      c = high - phi * (high - low);
      fc = evaluate(c);
    } else {
      low = c;
      c = d;
      fc = fd;
      d = low + phi * (high - low);
      fd = evaluate(d);
    }
  }

  const best = fc.sharpe > fd.sharpe ? fc : fd;

  return {
    gamma: Math.pow(10, best.logGamma),
    sharpe: best.sharpe,
    weights: best.weights
  };
}

export interface FrontierPoint {
  expectedReturn: number;
  volatility: number;
  weights: number[];
}

/** Efficient frontier from a sweep of the risk aversion gamma. */
export function efficientFrontier(
  mu: number[],
  sigma: Matrix,
  cap: number,
  points = 25
): FrontierPoint[] {
  const result: FrontierPoint[] = [];
  let start: number[] | undefined;

  for (let i = 0; i < points; i++) {
    const logGamma = 6 - (9 * i) / Math.max(points - 1, 1);
    const weights = maximizeUtility(
      mu,
      sigma,
      Math.pow(10, logGamma),
      cap,
      start
    );

    start = weights;
    result.push({
      expectedReturn: portfolioReturn(weights, mu),
      volatility: Math.sqrt(Math.max(portfolioVariance(weights, sigma), 0)),
      weights
    });
  }

  result.sort((a, b) => a.expectedReturn - b.expectedReturn);

  // Remove duplicates (frontier saturates at the corner portfolios)
  return result.filter((point, i) => {
    return (
      i === 0 ||
      Math.abs(point.expectedReturn - result[i - 1].expectedReturn) > 1e-9
    );
  });
}

/** Average loss of the worst (1 - alpha) share of the observations. */
export function cvarOfReturns(returns: number[], alpha: number): number {
  const losses = returns.map((value) => -value).sort((a, b) => b - a);
  const k = Math.min(
    losses.length,
    Math.max(1, Math.round((1 - alpha) * losses.length))
  );

  return sum(losses.slice(0, k)) / k;
}

/**
 * Minimum CVaR portfolio on historical scenarios (rows = periods, columns =
 * assets) with a projected subgradient method. The best iterate is kept, so
 * the result is never worse than the starting portfolios.
 */
export function minimizeCVaR(
  scenarios: Matrix,
  alpha: number,
  cap: number
): number[] {
  const t = scenarios.length;
  const n = scenarios[0]?.length ?? 0;
  const k = Math.min(t, Math.max(1, Math.round((1 - alpha) * t)));

  const cvar = (w: number[]) =>
    cvarOfReturns(
      scenarios.map((row) => dot(row, w)),
      alpha
    );

  const { sigma } = annualizeMeanCov(scenarios, 1);
  const candidates = [
    projectToCappedSimplex(equalWeights(n), cap),
    minimizeVariance(sigma, cap)
  ];

  let best = candidates[0];
  let bestValue = cvar(best);

  for (const candidate of candidates) {
    const value = cvar(candidate);

    if (value < bestValue) {
      best = candidate;
      bestValue = value;
    }
  }

  let w = best;

  for (let iteration = 0; iteration < 2000; iteration++) {
    const portfolioReturns = scenarios.map((row) => dot(row, w));
    const worst = portfolioReturns
      .map((value, index) => ({ index, value }))
      .sort((a, b) => a.value - b.value)
      .slice(0, k);

    const gradient = new Array(n).fill(0);

    for (const { index } of worst) {
      for (let asset = 0; asset < n; asset++) {
        gradient[asset] -= scenarios[index][asset] / k;
      }
    }

    const norm = Math.sqrt(dot(gradient, gradient));

    if (norm < 1e-14) {
      break;
    }

    const stepSize = 0.05 / Math.sqrt(iteration + 1);

    w = projectToCappedSimplex(
      w.map((value, i) => value - (stepSize * gradient[i]) / norm),
      cap
    );

    const value = cvar(w);

    if (value < bestValue) {
      best = w;
      bestValue = value;
    }
  }

  return best;
}

export function maxDrawdownOfReturns(returns: number[]): number {
  let equity = 1;
  let peak = 1;
  let maxDrawdown = 0;

  for (const value of returns) {
    equity *= 1 + value;
    peak = Math.max(peak, equity);
    maxDrawdown = Math.max(maxDrawdown, (peak - equity) / peak);
  }

  return maxDrawdown;
}

export interface PortfolioMetrics {
  annualReturn: number;
  annualVolatility: number;
  cvar95: number;
  maxDrawdown: number;
  sharpe: number;
  totalReturn: number;
}

/** Performance statistics of a series of periodic (simple) returns. */
export function portfolioMetrics(
  returns: number[],
  riskFreeRate: number,
  periodsPerYear = TRADING_DAYS_PER_YEAR
): PortfolioMetrics {
  const t = returns.length;
  const mean = t > 0 ? sum(returns) / t : 0;
  const variance =
    t > 1 ? sum(returns.map((r) => (r - mean) ** 2)) / (t - 1) : 0;
  const annualReturn = mean * periodsPerYear;
  const annualVolatility = Math.sqrt(variance * periodsPerYear);

  return {
    annualReturn,
    annualVolatility,
    cvar95: t > 0 ? cvarOfReturns(returns, 0.95) : 0,
    maxDrawdown: maxDrawdownOfReturns(returns),
    sharpe:
      annualVolatility > 1e-12
        ? (annualReturn - riskFreeRate) / annualVolatility
        : 0,
    totalReturn: returns.reduce((equity, r) => equity * (1 + r), 1) - 1
  };
}
