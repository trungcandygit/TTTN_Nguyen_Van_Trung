import {
  alignPrices,
  buildViews,
  optimize,
  runBacktest,
  simpleReturns
} from './optimizer.engine';

const sum = (values: number[]) => values.reduce((a, b) => a + b, 0);

/** Deterministic pseudo-random generator (LCG) for reproducible tests. */
function makeRandom(seed: number) {
  let state = seed;

  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;

    return state / 4294967296;
  };
}

/** Returns table with 3 assets: low vol, medium vol, high vol + higher mean. */
function makeReturns(rows = 400) {
  const random = makeRandom(42);
  const vols = [0.004, 0.01, 0.02];
  const means = [0.0002, 0.0004, 0.0008];

  return Array.from({ length: rows }, () =>
    vols.map(
      (vol, i) => means[i] + vol * (random() + random() + random() - 1.5)
    )
  );
}

describe('alignPrices', () => {
  it('forward fills gaps and starts when all assets have data', () => {
    const a = [
      { date: '2024-01-01', price: 10 },
      { date: '2024-01-02', price: 11 },
      { date: '2024-01-03', price: 12 }
    ];
    const b = [
      { date: '2024-01-02', price: 100 },
      { date: '2024-01-04', price: 110 }
    ];

    const { dates, prices } = alignPrices([a, b]);

    expect(dates).toEqual(['2024-01-02', '2024-01-03', '2024-01-04']);
    expect(prices).toEqual([
      [11, 100],
      [12, 100],
      [12, 110]
    ]);
  });

  it('returns empty result when an asset has no data', () => {
    expect(alignPrices([[{ date: '2024-01-01', price: 1 }], []]).dates).toEqual(
      []
    );
  });
});

describe('simpleReturns', () => {
  it('computes period returns', () => {
    expect(simpleReturns([[100], [110], [99]])[0][0]).toBeCloseTo(0.1, 12);
    expect(simpleReturns([[100], [110], [99]])[1][0]).toBeCloseTo(-0.1, 12);
  });
});

describe('buildViews', () => {
  const symbols = ['A', 'B', 'C'];

  it('builds absolute and relative views', () => {
    const views = buildViews(symbols, [
      { confidence: 0.6, expectedReturn: 0.1, symbol: 'A', type: 'ABSOLUTE' },
      {
        confidence: 0.4,
        expectedReturn: 0.03,
        symbol: 'B',
        type: 'RELATIVE',
        versusSymbol: 'C'
      }
    ]);

    expect(views[0].p).toEqual([1, 0, 0]);
    expect(views[0].q).toBe(0.1);
    expect(views[1].p).toEqual([0, 1, -1]);
    expect(views[1].confidence).toBe(0.4);
  });

  it('ignores views on unknown symbols or relative views without target', () => {
    const views = buildViews(symbols, [
      { confidence: 0.5, expectedReturn: 0.1, symbol: 'Z', type: 'ABSOLUTE' },
      { confidence: 0.5, expectedReturn: 0.1, symbol: 'A', type: 'RELATIVE' }
    ]);

    expect(views).toHaveLength(0);
  });
});

describe('optimize', () => {
  const returns = makeReturns();
  const base = {
    cvarAlpha: 0.95,
    marketWeights: [0.5, 0.3, 0.2],
    maxWeight: 1,
    returns,
    riskFreeRate: 0,
    tau: 0.05,
    views: []
  };

  it.each([
    'BLACK_LITTERMAN',
    'MAX_SHARPE',
    'MEAN_VARIANCE',
    'MIN_CVAR',
    'MIN_VARIANCE',
    'RISK_PARITY'
  ] as const)('%s returns long-only weights that sum to 1', (method) => {
    const { weights } = optimize({ ...base, method });

    expect(sum(weights)).toBeCloseTo(1, 6);
    weights.forEach((w) => expect(w).toBeGreaterThanOrEqual(-1e-9));
  });

  it('respects the maximum weight', () => {
    const { weights } = optimize({
      ...base,
      maxWeight: 0.4,
      method: 'MAX_SHARPE'
    });

    weights.forEach((w) => expect(w).toBeLessThanOrEqual(0.4 + 1e-6));
  });

  it('minimum variance favours the lowest volatility asset', () => {
    const { weights } = optimize({ ...base, method: 'MIN_VARIANCE' });

    expect(weights[0]).toBeGreaterThan(weights[2]);
  });

  it('a bullish absolute view raises the weight of that asset (Black-Litterman)', () => {
    const neutral = optimize({ ...base, method: 'BLACK_LITTERMAN' });
    const bullish = optimize({
      ...base,
      method: 'BLACK_LITTERMAN',
      views: [{ confidence: 0.9, p: [1, 0, 0], q: 0.5 }]
    });

    expect(bullish.weights[0]).toBeGreaterThan(neutral.weights[0]);
    expect(bullish.blackLitterman?.posteriorReturns[0]).toBeGreaterThan(
      neutral.blackLitterman?.posteriorReturns[0] ?? 0
    );
  });

  it('without views the posterior equals the equilibrium returns', () => {
    const { blackLitterman } = optimize({ ...base, method: 'BLACK_LITTERMAN' });

    blackLitterman?.posteriorReturns.forEach((value, i) =>
      expect(value).toBeCloseTo(blackLitterman.impliedReturns[i], 6)
    );
  });
});

describe('runBacktest', () => {
  const returns = makeReturns(500);
  const prices: number[][] = [[100, 100, 100]];

  for (const row of returns) {
    prices.push(prices[prices.length - 1].map((p, i) => p * (1 + row[i])));
  }

  const dates = prices.map((_, i) => `d${String(i).padStart(4, '0')}`);

  it('produces aligned equity curves for the strategy and baselines', () => {
    const result = runBacktest({
      currentWeights: [0.5, 0.3, 0.2],
      dates,
      lookback: 120,
      method: 'MIN_VARIANCE',
      optimizeOptions: {
        cvarAlpha: 0.95,
        maxWeight: 1,
        riskFreeRate: 0,
        tau: 0.05,
        views: []
      },
      prices,
      rebalanceEvery: 21
    });

    expect(result).not.toBeNull();
    expect(result?.series.map(({ key }) => key)).toEqual([
      'OPTIMIZED',
      'EQUAL',
      'CURRENT'
    ]);

    for (const { values } of result?.series ?? []) {
      expect(values).toHaveLength(result?.dates.length ?? -1);
      expect(values[0]).toBeCloseTo(100, 9);
    }

    expect(result?.rebalances).toBeGreaterThan(5);
  });

  it('returns null when there is not enough history', () => {
    expect(
      runBacktest({
        currentWeights: [0.5, 0.3, 0.2],
        dates: dates.slice(0, 100),
        lookback: 120,
        method: 'MIN_VARIANCE',
        optimizeOptions: {
          cvarAlpha: 0.95,
          maxWeight: 1,
          riskFreeRate: 0,
          tau: 0.05,
          views: []
        },
        prices: prices.slice(0, 100),
        rebalanceEvery: 21
      })
    ).toBeNull();
  });
});
