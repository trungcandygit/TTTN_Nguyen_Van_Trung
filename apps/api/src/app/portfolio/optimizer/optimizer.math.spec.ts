import {
  cvarOfReturns,
  efficientFrontier,
  equalWeights,
  inverseVolatilityWeights,
  maxDrawdownOfReturns,
  maximizeSharpe,
  maximizeUtility,
  minimizeCVaR,
  minimizeVariance,
  portfolioMetrics,
  portfolioVariance,
  projectToCappedSimplex,
  riskParityWeights
} from './optimizer.math';

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

// Uncorrelated assets with variances 4%, 9% and 16%
const sigma = [
  [0.04, 0, 0],
  [0, 0.09, 0],
  [0, 0, 0.16]
];

describe('projectToCappedSimplex', () => {
  it('returns weights that sum to 1 and respect the cap', () => {
    const w = projectToCappedSimplex([0.5, 0.5, 0.5], 0.4);

    expect(sum(w)).toBeCloseTo(1, 9);
    w.forEach((value) => expect(value).toBeCloseTo(1 / 3, 6));
  });

  it('puts everything on the dominant asset when the cap allows it', () => {
    const w = projectToCappedSimplex([2, 0, 0], 1);

    expect(w[0]).toBeCloseTo(1, 6);
    expect(w[1]).toBeCloseTo(0, 6);
  });

  it('never returns negative weights (long-only)', () => {
    projectToCappedSimplex([3, -5, 0.2, 1], 0.6).forEach((value) => {
      expect(value).toBeGreaterThanOrEqual(-1e-12);
      expect(value).toBeLessThanOrEqual(0.6 + 1e-9);
    });
  });
});

describe('baseline weights', () => {
  it('equal weights are 1/n', () => {
    expect(equalWeights(4)).toEqual([0.25, 0.25, 0.25, 0.25]);
  });

  it('inverse volatility weights are proportional to 1/sigma', () => {
    const w = inverseVolatilityWeights(sigma);
    const inv = [1 / 0.2, 1 / 0.3, 1 / 0.4];
    const total = sum(inv);

    w.forEach((value, i) => expect(value).toBeCloseTo(inv[i] / total, 9));
  });

  it('risk parity equalizes the risk contributions', () => {
    const w = riskParityWeights([
      [0.04, 0],
      [0, 0.16]
    ]);

    // weights proportional to 1/volatility: 5 : 2.5
    expect(w[0]).toBeCloseTo(2 / 3, 4);
    expect(w[1]).toBeCloseTo(1 / 3, 4);
  });
});

describe('minimizeVariance', () => {
  it('weights are proportional to 1/variance for uncorrelated assets', () => {
    const w = minimizeVariance(sigma, 1);
    const inv = [25, 1 / 0.09, 6.25];
    const total = sum(inv);

    w.forEach((value, i) => expect(value).toBeCloseTo(inv[i] / total, 3));
  });

  it('respects the maximum weight per asset', () => {
    const w = minimizeVariance(sigma, 0.5);

    expect(w[0]).toBeCloseTo(0.5, 4);
    // remaining 0.5 is split in proportion to 1/variance: 11.11 : 6.25
    expect(w[1]).toBeCloseTo(0.32, 3);
    expect(w[2]).toBeCloseTo(0.18, 3);
    expect(sum(w)).toBeCloseTo(1, 6);
  });

  it('has lower variance than the equal-weight portfolio', () => {
    expect(portfolioVariance(minimizeVariance(sigma, 1), sigma)).toBeLessThan(
      portfolioVariance(equalWeights(3), sigma)
    );
  });

  it('is feasible even if the cap is below 1/n (cap is raised to 1/n)', () => {
    const w = minimizeVariance(sigma, 0.1);

    w.forEach((value) => expect(value).toBeCloseTo(1 / 3, 6));
  });
});

describe('maximizeUtility / maximizeSharpe', () => {
  const mu = [0.1, 0.12, 0.08];

  it('a very risk-averse investor holds the minimum-variance portfolio', () => {
    const w = maximizeUtility(mu, sigma, 1e4, 1);
    const wMin = minimizeVariance(sigma, 1);

    w.forEach((value, i) => expect(value).toBeCloseTo(wMin[i], 2));
  });

  it('a risk-neutral investor holds the asset with the highest return', () => {
    const w = maximizeUtility(mu, sigma, 1e-4, 1);

    expect(w[1]).toBeGreaterThan(0.95);
  });

  it('the max-Sharpe portfolio matches the closed-form tangency portfolio', () => {
    const rf = 0.02;
    const { weights } = maximizeSharpe(mu, sigma, rf, 1);
    const excess = mu.map((m) => m - rf);
    const raw = excess.map((e, i) => e / sigma[i][i]);
    const total = sum(raw);

    weights.forEach((value, i) => expect(value).toBeCloseTo(raw[i] / total, 2));
  });

  it('the max-Sharpe portfolio beats equal weights on Sharpe ratio', () => {
    const rf = 0.02;
    const sharpe = (w: number[]) =>
      (w.reduce((s, x, i) => s + x * mu[i], 0) - rf) /
      Math.sqrt(portfolioVariance(w, sigma));

    expect(sharpe(maximizeSharpe(mu, sigma, rf, 1).weights)).toBeGreaterThan(
      sharpe(equalWeights(3))
    );
  });
});

describe('efficientFrontier', () => {
  it('returns points with non-decreasing volatility as return grows', () => {
    const points = efficientFrontier([0.1, 0.12, 0.08], sigma, 1, 12);

    expect(points.length).toBeGreaterThanOrEqual(5);

    for (let i = 1; i < points.length; i++) {
      expect(points[i].expectedReturn).toBeGreaterThanOrEqual(
        points[i - 1].expectedReturn - 1e-9
      );
      expect(points[i].volatility).toBeGreaterThanOrEqual(
        points[i - 1].volatility - 1e-6
      );
    }
  });
});

describe('CVaR', () => {
  it('cvarOfReturns is the average loss of the worst (1 - alpha) tail', () => {
    const returns = [
      -0.1, -0.08, 0.01, 0.02, 0.03, 0.01, 0.02, 0.0, 0.01, 0.02
    ];

    // worst 20% = 2 observations -> mean loss (0.10 + 0.08) / 2
    expect(cvarOfReturns(returns, 0.8)).toBeCloseTo(0.09, 9);
  });

  it('minimizeCVaR avoids the asset with a fat left tail', () => {
    // asset A: +1% most days but a -25% crash every 20th day
    // asset B: small symmetric noise
    const scenarios: number[][] = [];

    for (let t = 0; t < 200; t++) {
      const a = t % 20 === 0 ? -0.25 : 0.01;
      const b = t % 2 === 0 ? 0.02 : -0.02;

      scenarios.push([a, b]);
    }

    const w = minimizeCVaR(scenarios, 0.95, 1);
    const cvar = (weights: number[]) =>
      cvarOfReturns(
        scenarios.map((row) => row[0] * weights[0] + row[1] * weights[1]),
        0.95
      );

    expect(sum(w)).toBeCloseTo(1, 6);
    expect(w[1]).toBeGreaterThan(0.5);
    expect(cvar(w)).toBeLessThanOrEqual(cvar([0.5, 0.5]) + 1e-9);
  });
});

describe('portfolio metrics', () => {
  it('maxDrawdownOfReturns measures the largest peak-to-trough loss', () => {
    // equity: 1.1, 0.55, 0.66 -> drawdown 50%
    expect(maxDrawdownOfReturns([0.1, -0.5, 0.2])).toBeCloseTo(0.5, 9);
  });

  it('computes annualized return, volatility and Sharpe ratio', () => {
    const daily = [0.01, -0.01, 0.01, -0.01, 0.01, -0.01];
    const metrics = portfolioMetrics(daily, 0, 252);

    expect(metrics.annualVolatility).toBeGreaterThan(0);
    // equity peaks at 1.01 and falls to 0.9999^3 = 0.99970003
    expect(metrics.maxDrawdown).toBeCloseTo((1.01 - 0.9999 ** 3) / 1.01, 9);
    expect(Number.isFinite(metrics.sharpe)).toBe(true);
  });

  it('a constant-return series has zero volatility and a finite Sharpe (0)', () => {
    const metrics = portfolioMetrics([0.001, 0.001, 0.001], 0, 252);

    expect(metrics.annualVolatility).toBeCloseTo(0, 12);
    expect(metrics.sharpe).toBe(0);
  });
});
