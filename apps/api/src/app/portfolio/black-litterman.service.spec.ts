/**
 * Unit tests for the Black-Litterman model helper functions
 * (student's own contribution, PTIT graduation internship project).
 *
 * Direct TypeScript port of the 4 pytest cases of the project's initial
 * FastAPI prototype (removed from the repository, see git history):
 *   1. No views reduces the posterior returns to the implied equilibrium
 *      returns.
 *   2. A single absolute view pulls the posterior return of that asset
 *      toward the view.
 *   3. The optimal weights sum to 1 after normalization.
 *   4. The optimal weights match the manual closed-form formula.
 */
import { BadRequestException } from '@nestjs/common';

import {
  BlackLittermanInputs,
  BlackLittermanService,
  Matrix,
  addMatrices,
  identity,
  impliedEquilibriumReturns,
  invertMatrix,
  optimalWeights,
  posteriorReturns,
  runBlackLitterman,
  scaleMatrix,
  solveLinearSystem
} from './black-litterman.service';

function toyInputs(
  p: Matrix,
  q: number[],
  omega?: Matrix
): BlackLittermanInputs {
  const sigma: Matrix = [
    [0.04, 0.012, 0.008],
    [0.012, 0.0225, 0.006],
    [0.008, 0.006, 0.01]
  ];
  const wMkt = [0.5, 0.3, 0.2];

  return { sigma, wMkt, delta: 2.5, tau: 0.05, p, q, omega };
}

describe('BlackLitterman (portfolio model)', () => {
  it('reduces to the equilibrium returns when there are no views', () => {
    const p: Matrix = [[0, 0, 0]];
    const q = [0];
    const omega: Matrix = [[1e6]]; // huge uncertainty -> the view carries no weight

    const inputs = toyInputs(p, q, omega);
    const { eR } = posteriorReturns(inputs);
    const pi = impliedEquilibriumReturns(
      inputs.sigma,
      inputs.wMkt,
      inputs.delta
    );

    eR.forEach((value, i) => {
      expect(value).toBeCloseTo(pi[i], 3);
    });
  });

  it('pulls the posterior return toward a single absolute view', () => {
    const p: Matrix = [[1, 0, 0]];
    const q = [0.15];

    const inputs = toyInputs(p, q);
    const pi = impliedEquilibriumReturns(
      inputs.sigma,
      inputs.wMkt,
      inputs.delta
    );
    const { eR, mInv } = posteriorReturns(inputs);

    expect(mInv.length).toBe(3);
    expect(mInv[0].length).toBe(3);
    // The view (0.15) is above pi[0], so E[R][0] must move up, toward 0.15.
    expect(eR[0]).toBeGreaterThan(pi[0]);
    expect(eR[0]).toBeLessThan(0.15 + 1e-6);
  });

  it('normalizes the optimal weights so they sum to 1', () => {
    const p: Matrix = [[1, -1, 0]]; // asset 1 outperforms asset 2 by 5%/year
    const q = [0.05];

    const inputs = toyInputs(p, q);
    const result = runBlackLitterman(inputs);
    const sum = result.weightsOptimal.reduce((acc, value) => acc + value, 0);

    expect(sum).toBeCloseTo(1, 9);
  });

  it('matches the manual closed-form optimal-weights formula', () => {
    const p: Matrix = [[1, 0, 0]];
    const q = [0.1];

    const inputs = toyInputs(p, q);
    const { eR, mInv } = posteriorReturns(inputs);
    const w = optimalWeights(eR, mInv, inputs.sigma, inputs.delta);

    const totalCov = addMatrices(inputs.sigma, mInv);
    const expected = solveLinearSystem(scaleMatrix(totalCov, inputs.delta), eR);

    w.forEach((value, i) => {
      expect(value).toBeCloseTo(expected[i], 9);
    });
  });

  it('inverts the identity matrix to itself (sanity check for the linear algebra helpers)', () => {
    const n = 4;
    const inv = invertMatrix(identity(n));

    inv.forEach((row, i) => {
      row.forEach((value, j) => {
        expect(value).toBeCloseTo(i === j ? 1 : 0, 9);
      });
    });
  });
});

describe('BlackLittermanService.getAllocation', () => {
  function createService(holdings: unknown[]) {
    const marketDataService = { getRange: jest.fn().mockResolvedValue([]) };
    const portfolioService = {
      getDetails: jest.fn().mockResolvedValue({ holdings })
    };

    return new BlackLittermanService(
      marketDataService as never,
      portfolioService as never
    );
  }

  it('rejects an empty portfolio with a 400 instead of an internal server error', async () => {
    await expect(
      createService([]).getAllocation({ userId: 'user' })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects a portfolio with a single holding with a 400', async () => {
    const holdings = [
      {
        valueInBaseCurrency: 100,
        allocationInPercentage: 1,
        assetProfile: { dataSource: 'YAHOO', symbol: 'AAPL', name: 'Apple' }
      }
    ];

    await expect(
      createService(holdings).getAllocation({ userId: 'user' })
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
