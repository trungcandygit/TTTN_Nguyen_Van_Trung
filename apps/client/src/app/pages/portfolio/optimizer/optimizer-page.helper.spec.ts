import {
  OptimizerForm,
  buildOptimizerRequest,
  validateOptimizerForm
} from './optimizer-page.helper';

const form: OptimizerForm = {
  assets: [
    { dataSource: 'MANUAL', symbol: 'A' },
    { dataSource: 'MANUAL', symbol: 'B' }
  ],
  backtest: true,
  backtestLookbackDays: 252,
  backtestRebalance: 'QUARTERLY',
  cvarAlphaPercent: 95,
  lookbackDays: 730,
  maxWeightPercent: 60,
  method: 'BLACK_LITTERMAN',
  riskAversion: 2.5,
  riskFreeRatePercent: 3,
  tauPercent: 5,
  views: [
    {
      confidencePercent: 70,
      expectedReturnPercent: 12,
      symbol: 'A',
      type: 'ABSOLUTE'
    },
    {
      confidencePercent: 50,
      expectedReturnPercent: 2,
      symbol: 'B',
      type: 'RELATIVE',
      versusSymbol: 'B'
    },
    {
      confidencePercent: 50,
      expectedReturnPercent: 2,
      symbol: 'B',
      type: 'RELATIVE',
      versusSymbol: 'A'
    }
  ]
};

describe('buildOptimizerRequest', () => {
  it('converts percentages to fractions', () => {
    const request = buildOptimizerRequest(form);

    expect(request.maxWeight).toBeCloseTo(0.6);
    expect(request.riskFreeRate).toBeCloseTo(0.03);
    expect(request.cvarAlpha).toBeCloseTo(0.95);
    expect(request.tau).toBeCloseTo(0.05);
  });

  it('keeps valid views and drops relative views against themselves', () => {
    const request = buildOptimizerRequest(form);

    expect(request.views).toHaveLength(2);
    expect(request.views?.[0]).toMatchObject({
      confidence: 0.7,
      expectedReturn: 0.12,
      type: 'ABSOLUTE'
    });
    expect(request.views?.[1].versusSymbol).toBe('A');
  });

  it('sends no views for other methods', () => {
    expect(
      buildOptimizerRequest({ ...form, method: 'MAX_SHARPE' }).views
    ).toBeUndefined();
  });
});

describe('validateOptimizerForm', () => {
  it('accepts a valid form', () => {
    expect(validateOptimizerForm(form)).toBeNull();
  });

  it('requires at least two assets', () => {
    expect(
      validateOptimizerForm({ ...form, assets: form.assets.slice(0, 1) })
    ).toContain('ít nhất 2');
  });

  it('rejects a maximum weight that makes the problem infeasible', () => {
    expect(validateOptimizerForm({ ...form, maxWeightPercent: 30 })).toContain(
      'Trọng số tối đa'
    );
  });
});
