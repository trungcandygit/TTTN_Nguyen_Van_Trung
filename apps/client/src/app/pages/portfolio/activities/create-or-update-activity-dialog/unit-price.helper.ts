/**
 * Returns the market price to prefill into the unit price field after an
 * asset profile has been selected, or `undefined` if the field must be left
 * untouched (existing activity, price already entered, no market price).
 */
export function getUnitPriceToPrefill({
  currentUnitPrice,
  marketPrice,
  mode
}: {
  currentUnitPrice?: number | null;
  marketPrice?: number | null;
  mode: 'create' | 'update';
}): number | undefined {
  if (mode !== 'create' || !marketPrice || currentUnitPrice) {
    return undefined;
  }

  return marketPrice;
}
