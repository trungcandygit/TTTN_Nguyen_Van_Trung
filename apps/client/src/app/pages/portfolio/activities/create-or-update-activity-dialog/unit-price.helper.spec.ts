import { getUnitPriceToPrefill } from './unit-price.helper';

describe('getUnitPriceToPrefill', () => {
  it('prefills the market price when creating an activity without a price yet', () => {
    expect(
      getUnitPriceToPrefill({
        currentUnitPrice: null,
        marketPrice: 189.5,
        mode: 'create'
      })
    ).toBe(189.5);
  });

  it('treats a price of 0 as not entered yet', () => {
    expect(
      getUnitPriceToPrefill({
        currentUnitPrice: 0,
        marketPrice: 189.5,
        mode: 'create'
      })
    ).toBe(189.5);
  });

  it('never overwrites a price the user already entered', () => {
    expect(
      getUnitPriceToPrefill({
        currentUnitPrice: 150,
        marketPrice: 189.5,
        mode: 'create'
      })
    ).toBeUndefined();
  });

  it('does not change the price of an existing activity', () => {
    expect(
      getUnitPriceToPrefill({
        currentUnitPrice: null,
        marketPrice: 189.5,
        mode: 'update'
      })
    ).toBeUndefined();
  });

  it('does nothing when no market price is available', () => {
    expect(
      getUnitPriceToPrefill({
        currentUnitPrice: null,
        marketPrice: 0,
        mode: 'create'
      })
    ).toBeUndefined();
  });
});
