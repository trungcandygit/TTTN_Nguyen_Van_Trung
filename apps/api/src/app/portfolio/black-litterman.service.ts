import { PortfolioService } from '@ghostfolio/api/app/portfolio/portfolio.service';
import { MarketDataService } from '@ghostfolio/api/services/market-data/market-data.service';
import { AssetProfileIdentifier } from '@ghostfolio/common/interfaces';

import { Injectable } from '@nestjs/common';
import { subDays } from 'date-fns';

/**
 * Black-Litterman portfolio allocation.
 *
 * This service is the student's own contribution to the forked Ghostfolio
 * codebase (graduation internship project, PTIT). It is a direct
 * TypeScript port of the Python reference implementation that was
 * developed and unit-tested first in
 * `legacy-fastapi-prototype/apps/api/app/core/black_litterman.py` and
 * `legacy-fastapi-prototype/apps/api/app/core/portfolio_stats.py`. The
 * mathematics are unchanged from that reference implementation; only the
 * implementation language changed, so that the model can run inside
 * Ghostfolio's NestJS backend and read a user's real holdings through
 * Prisma instead of a synthetic CSV.
 *
 * Notation follows Black, F., & Litterman, R. (1992). Global Portfolio
 * Optimization. Financial Analysts Journal, 48(5), 28-43, and He, G., &
 * Litterman, R. (1999). The Intuition Behind Black-Litterman Model
 * Portfolios:
 *   sigma  : (n x n) covariance matrix of asset returns
 *   wMkt   : (n,)    market-capitalization (here: current portfolio value)
 *                     weights of the reference portfolio
 *   delta  : risk-aversion coefficient
 *   tau    : scalar indicating the uncertainty of the prior (pi)
 *   p      : (k x n) "pick" matrix of the investor views
 *   q      : (k,)    expected-return vector of the investor views
 *   omega  : (k x k) diagonal covariance matrix of the uncertainty of the
 *                     views (computed with the He & Litterman (1999)
 *                     default when not supplied)
 */

export type Matrix = number[][];

export interface BlackLittermanInputs {
  sigma: Matrix;
  wMkt: number[];
  delta: number;
  tau: number;
  p: Matrix;
  q: number[];
  omega?: Matrix;
}

export interface BlackLittermanResult {
  impliedEquilibriumReturns: number[];
  posteriorReturns: number[];
  posteriorCovariance: Matrix;
  weightsMarket: number[];
  weightsOptimal: number[];
}

export interface BlackLittermanAllocationEntry {
  symbol: string;
  name: string;
  currentWeight: number;
  blackLittermanWeight: number;
}

export interface BlackLittermanAllocationResponse {
  asOf: string;
  holdings: BlackLittermanAllocationEntry[];
  result: BlackLittermanResult;
}

// ---------------------------------------------------------------------------
// Minimal dependency-free linear algebra helpers (n is small: the number of
// distinct holdings in a user's portfolio), equivalent to the numpy
// operations used in the Python reference implementation.
// ---------------------------------------------------------------------------

export function matMul(a: Matrix, b: Matrix): Matrix {
  const rows = a.length;
  const inner = b.length;
  const cols = b[0]?.length ?? 0;

  const result: Matrix = Array.from({ length: rows }, () =>
    new Array(cols).fill(0)
  );

  for (let i = 0; i < rows; i++) {
    for (let k = 0; k < inner; k++) {
      const aik = a[i][k];

      if (aik === 0) {
        continue;
      }

      for (let j = 0; j < cols; j++) {
        result[i][j] += aik * b[k][j];
      }
    }
  }

  return result;
}

export function matVecMul(a: Matrix, v: number[]): number[] {
  return a.map((row) => row.reduce((sum, value, j) => sum + value * v[j], 0));
}

export function transpose(a: Matrix): Matrix {
  const rows = a.length;
  const cols = a[0]?.length ?? 0;

  return Array.from({ length: cols }, (_, j) =>
    Array.from({ length: rows }, (_, i) => a[i][j])
  );
}

export function scaleMatrix(a: Matrix, scalar: number): Matrix {
  return a.map((row) => row.map((value) => value * scalar));
}

export function addMatrices(a: Matrix, b: Matrix): Matrix {
  return a.map((row, i) => row.map((value, j) => value + b[i][j]));
}

export function identity(n: number): Matrix {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))
  );
}

export function diag(values: number[]): Matrix {
  const n = values.length;

  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? values[i] : 0))
  );
}

/**
 * Inverts a square matrix using Gauss-Jordan elimination with partial
 * pivoting. Equivalent to numpy.linalg.inv() for the small, well-behaved
 * (positive-definite covariance-derived) matrices used here.
 */
export function invertMatrix(matrix: Matrix): Matrix {
  const n = matrix.length;
  const augmented = matrix.map((row, i) => [...row, ...identity(n)[i]]);

  for (let col = 0; col < n; col++) {
    let pivotRow = col;

    for (let row = col + 1; row < n; row++) {
      if (Math.abs(augmented[row][col]) > Math.abs(augmented[pivotRow][col])) {
        pivotRow = row;
      }
    }

    if (Math.abs(augmented[pivotRow][col]) < 1e-12) {
      throw new Error('Matrix is singular and cannot be inverted');
    }

    [augmented[col], augmented[pivotRow]] = [
      augmented[pivotRow],
      augmented[col]
    ];

    const pivot = augmented[col][col];

    for (let j = 0; j < 2 * n; j++) {
      augmented[col][j] /= pivot;
    }

    for (let row = 0; row < n; row++) {
      if (row === col) {
        continue;
      }

      const factor = augmented[row][col];

      if (factor === 0) {
        continue;
      }

      for (let j = 0; j < 2 * n; j++) {
        augmented[row][j] -= factor * augmented[col][j];
      }
    }
  }

  return augmented.map((row) => row.slice(n));
}

/** Solves the linear system a * x = b for x, i.e. x = inv(a) * b. */
export function solveLinearSystem(a: Matrix, b: number[]): number[] {
  return matVecMul(invertMatrix(a), b);
}

// ---------------------------------------------------------------------------
// Black-Litterman model (direct port of black_litterman.py)
// ---------------------------------------------------------------------------

/** pi = delta * Sigma * w_mkt (implied equilibrium returns). */
export function impliedEquilibriumReturns(
  sigma: Matrix,
  wMkt: number[],
  delta: number
): number[] {
  return matVecMul(sigma, wMkt).map((value) => value * delta);
}

/**
 * Omega = diag(tau * P Sigma P') (He & Litterman, 1999). Assumes the views
 * are independent of each other (diagonal matrix); the uncertainty of each
 * view is proportional to the variance of that view's portfolio under
 * Sigma.
 */
export function defaultOmega(tau: number, p: Matrix, sigma: Matrix): Matrix {
  const pSigmaPt = matMul(matMul(p, sigma), transpose(p));
  const diagonal = pSigmaPt.map((row, i) => tau * row[i]);

  return diag(diagonal);
}

/**
 * Computes the posterior expected returns E[R] and their posterior
 * covariance (Black & Litterman, 1992; canonical form of He & Litterman,
 * 1999):
 *
 *   E[R] = [ (tau*Sigma)^-1 + P' Omega^-1 P ]^-1
 *          [ (tau*Sigma)^-1 * pi + P' Omega^-1 * Q ]
 *
 *   M^-1 = [ (tau*Sigma)^-1 + P' Omega^-1 P ]^-1   (covariance of E[R])
 */
export function posteriorReturns(inputs: BlackLittermanInputs): {
  eR: number[];
  mInv: Matrix;
} {
  const { sigma, wMkt, delta, tau, p, q } = inputs;
  const omega = inputs.omega ?? defaultOmega(tau, p, sigma);

  const pi = impliedEquilibriumReturns(sigma, wMkt, delta);

  const tauSigmaInv = invertMatrix(scaleMatrix(sigma, tau));
  const omegaInv = invertMatrix(omega);

  const pT = transpose(p);
  const mInv = invertMatrix(
    addMatrices(tauSigmaInv, matMul(matMul(pT, omegaInv), p))
  );

  const rightHandSide = matVecMul(tauSigmaInv, pi).map(
    (value, i) => value + matVecMul(matMul(pT, omegaInv), q)[i]
  );

  const eR = matVecMul(mInv, rightHandSide);

  return { eR, mInv };
}

/**
 * Unconstrained mean-variance optimal portfolio weights:
 *
 *   w* = (delta * (Sigma + M^-1))^-1 * E[R]
 *
 * Sigma + M^-1 is the sum of the return covariance and the covariance of
 * the posterior E[R] estimate (Black & Litterman, 1992, Eq. 13).
 */
export function optimalWeights(
  eR: number[],
  posteriorCov: Matrix,
  sigma: Matrix,
  delta: number
): number[] {
  const totalCov = addMatrices(sigma, posteriorCov);

  return solveLinearSystem(scaleMatrix(totalCov, delta), eR);
}

export function runBlackLitterman(
  inputs: BlackLittermanInputs
): BlackLittermanResult {
  const { eR, mInv } = posteriorReturns(inputs);
  const wStar = optimalWeights(eR, mInv, inputs.sigma, inputs.delta);
  const wStarSum = wStar.reduce((sum, value) => sum + value, 0);
  const wStarNormalized =
    wStarSum === 0 ? wStar : wStar.map((value) => value / wStarSum);

  const pi = impliedEquilibriumReturns(inputs.sigma, inputs.wMkt, inputs.delta);

  return {
    impliedEquilibriumReturns: pi,
    posteriorReturns: eR,
    posteriorCovariance: mInv,
    weightsMarket: inputs.wMkt,
    weightsOptimal: wStarNormalized
  };
}

// ---------------------------------------------------------------------------
// Portfolio statistics helpers (direct port of portfolio_stats.py)
// ---------------------------------------------------------------------------

/** Log returns from a table of closing prices, one column per asset. */
export function logReturns(prices: Matrix): Matrix {
  const returns: Matrix = [];

  for (let t = 1; t < prices.length; t++) {
    returns.push(
      prices[t].map((price, asset) => Math.log(price / prices[t - 1][asset]))
    );
  }

  return returns;
}

/** Annualizes the sample mean and covariance of a returns table. */
export function annualizeMeanCov(
  returns: Matrix,
  periodsPerYear = 252
): { mu: number[]; sigma: Matrix } {
  const n = returns[0]?.length ?? 0;
  const t = returns.length;

  const mu = Array.from({ length: n }, (_, asset) => {
    const sum = returns.reduce((acc, row) => acc + row[asset], 0);

    return (sum / t) * periodsPerYear;
  });

  const means = Array.from(
    { length: n },
    (_, asset) => returns.reduce((acc, row) => acc + row[asset], 0) / t
  );

  const sigma: Matrix = Array.from({ length: n }, () => new Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      let covariance = 0;

      for (let row = 0; row < t; row++) {
        covariance +=
          (returns[row][i] - means[i]) * (returns[row][j] - means[j]);
      }

      // sample covariance (ddof = 1), matching pandas' default .cov()
      sigma[i][j] = t > 1 ? (covariance / (t - 1)) * periodsPerYear : 0;
    }
  }

  return { mu, sigma };
}

/** w_mkt = market cap_i / sum(market cap). */
export function impliedMarketWeights(marketCaps: number[]): number[] {
  const total = marketCaps.reduce((sum, value) => sum + value, 0);

  return marketCaps.map((value) => (total === 0 ? 0 : value / total));
}

/** delta = (E[R_m] - r_f) / Var(R_m) (He & Litterman, 1999, Eq. 17). */
export function impliedRiskAversion(
  marketReturn: number,
  marketVariance: number,
  riskFreeRate = 0
): number {
  return marketVariance === 0
    ? 0
    : (marketReturn - riskFreeRate) / marketVariance;
}

// ---------------------------------------------------------------------------
// NestJS service: reads a user's real holdings and historical prices via
// Prisma (through PortfolioService / MarketDataService) and runs the model
// above on them. No investor views are configurable through the UI yet, so
// by default P/Q are empty and Omega has effectively infinite uncertainty,
// which makes the posterior returns equal to the implied equilibrium
// returns (see the "no view" unit test); this is documented as a
// limitation in the internship report.
// ---------------------------------------------------------------------------

const TRADING_DAYS_PER_YEAR = 252;
const LOOKBACK_DAYS = 365;
const DEFAULT_TAU = 0.05;
const DEFAULT_RISK_FREE_RATE = 0;

@Injectable()
export class BlackLittermanService {
  public constructor(
    private readonly marketDataService: MarketDataService,
    private readonly portfolioService: PortfolioService
  ) {}

  public async getAllocation({
    userId
  }: {
    userId: string;
  }): Promise<BlackLittermanAllocationResponse> {
    const { holdings } = await this.portfolioService.getDetails({
      userId,
      withSummary: false
    });

    const positions = holdings.filter(
      (holding) =>
        (holding.valueInBaseCurrency ?? 0) > 0 &&
        holding.assetProfile?.dataSource
    );

    if (positions.length < 2) {
      throw new Error(
        'At least two holdings with a positive value are required to compute a Black-Litterman allocation'
      );
    }

    const identifiers: AssetProfileIdentifier[] = positions.map((position) => ({
      dataSource: position.assetProfile.dataSource,
      symbol: position.assetProfile.symbol
    }));

    const marketData = await this.marketDataService.getRange({
      assetProfileIdentifiers: identifiers,
      dateQuery: { gte: subDays(new Date(), LOOKBACK_DAYS) }
    });

    const pricesBySymbol = new Map<string, { date: Date; price: number }[]>();

    for (const identifier of identifiers) {
      pricesBySymbol.set(identifier.symbol, []);
    }

    for (const item of marketData) {
      pricesBySymbol.get(item.symbol)?.push({
        date: item.date,
        price: item.marketPrice
      });
    }

    const sortedDates = Array.from(
      new Set(marketData.map((item) => item.date.getTime()))
    ).sort((a, b) => a - b);

    const priceMatrix: Matrix = sortedDates.map((time) =>
      positions.map((position) => {
        const series = pricesBySymbol.get(position.assetProfile.symbol) ?? [];
        const point = series.find((entry) => entry.date.getTime() === time);

        return point?.price ?? null;
      })
    ) as Matrix;

    const completeRows = priceMatrix.filter((row) =>
      row.every((value) => value !== null && Number.isFinite(value))
    );

    const wMkt = positions.map(
      (position) => position.allocationInPercentage ?? 0
    );

    let sigma: Matrix;
    let mu: number[];

    if (completeRows.length >= 10) {
      const returns = logReturns(completeRows);
      ({ mu, sigma } = annualizeMeanCov(returns, TRADING_DAYS_PER_YEAR));
    } else {
      // Not enough overlapping historical price history for this user's
      // holdings yet (e.g. freshly created demo portfolio): fall back to a
      // small, symmetric placeholder covariance so the endpoint still
      // returns a well-defined result instead of failing. This is reported
      // as a limitation in the internship report.
      const n = positions.length;
      sigma = identity(n).map((row) => row.map((value) => value * 0.04));
      mu = new Array(n).fill(0);
    }

    const marketReturn = mu.reduce(
      (sum, assetMu, i) => sum + wMkt[i] * assetMu,
      0
    );
    const marketVariance = matVecMul(sigma, wMkt).reduce(
      (sum, value, i) => sum + value * wMkt[i],
      0
    );
    const impliedDelta =
      marketVariance > 0
        ? impliedRiskAversion(
            marketReturn,
            marketVariance,
            DEFAULT_RISK_FREE_RATE
          )
        : 0;
    // Fall back to the common textbook default (delta = 2.5) whenever the
    // implied risk-aversion coefficient is not strictly positive (e.g. a
    // negative or zero recent market return), since a non-positive delta
    // is not economically meaningful here.
    const delta = impliedDelta > 0 ? impliedDelta : 2.5;

    const n = positions.length;
    const p: Matrix = [new Array(n).fill(0)];
    const q: number[] = [0];
    const omega: Matrix = [[1e6]];

    const result = runBlackLitterman({
      sigma,
      wMkt,
      delta,
      tau: DEFAULT_TAU,
      p,
      q,
      omega
    });

    return {
      asOf: new Date().toISOString(),
      holdings: positions.map((position, i) => ({
        symbol: position.assetProfile.symbol,
        name: position.assetProfile.name,
        currentWeight: wMkt[i],
        blackLittermanWeight: result.weightsOptimal[i]
      })),
      result
    };
  }
}
