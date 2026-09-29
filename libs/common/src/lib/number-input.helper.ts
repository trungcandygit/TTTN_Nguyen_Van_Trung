/**
 * Helpers for number input fields in Vietnamese format: the dot separates
 * thousands (1.000.000) and the comma is the decimal separator (1.234,56).
 */

const groupThousands = (digits: string) =>
  digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

/** Reads a number typed or pasted by the user. Returns null if invalid. */
export function parseNumberInput(text: string): number | null {
  let body = (text ?? '').replace(/\s/g, '');
  const negative = body.startsWith('-');

  if (negative) {
    body = body.slice(1);
  }

  if (!/^[\d.,]+$/.test(body) || !/\d/.test(body)) {
    return null;
  }

  let normalized: string;

  if (body.includes(',')) {
    // Comma is the decimal separator, dots are thousands separators
    const [integerPart, ...rest] = body.split(',');

    normalized = `${integerPart.replace(/\./g, '') || '0'}${rest.join('') ? '.' + rest.join('') : ''}`;
  } else if (body.includes('.')) {
    if (/^\d{1,3}(\.\d{3})+$/.test(body)) {
      // 1.000 or 1.000.000: thousands separators
      normalized = body.replace(/\./g, '');
    } else if (body.split('.').length === 2) {
      // 1000.5 or 0.25: a single dot is a decimal point
      normalized = body;
    } else {
      normalized = body.replace(/\./g, '');
    }
  } else {
    normalized = body;
  }

  const value = Number(normalized);

  if (!Number.isFinite(value)) {
    return null;
  }

  return negative ? -value : value;
}

/**
 * Cleans and formats the text of an input field while the user is typing:
 * groups the integer part with dots, keeps the comma and the decimals. A dot
 * typed at the start of the number ("0." or ".5") is the decimal separator.
 */
export function formatTypedNumber(text: string): string {
  const trimmed = (text ?? '').trim();
  const negative = trimmed.startsWith('-');
  const body = trimmed.replace(/-/g, '');
  const digitsOnly = (value: string) => value.replace(/\D/g, '');

  let integerDigits: string;
  let decimalDigits: string | undefined;

  const commaIndex = body.indexOf(',');
  const dotIndex = body.indexOf('.');

  if (commaIndex >= 0) {
    integerDigits = digitsOnly(body.slice(0, commaIndex));
    decimalDigits = digitsOnly(body.slice(commaIndex + 1));
  } else if (
    dotIndex >= 0 &&
    /^0*$/.test(digitsOnly(body.slice(0, dotIndex)))
  ) {
    integerDigits = digitsOnly(body.slice(0, dotIndex));
    decimalDigits = digitsOnly(body.slice(dotIndex + 1));
  } else {
    integerDigits = digitsOnly(body);
  }

  integerDigits = integerDigits.replace(/^0+(?=\d)/, '');

  if (decimalDigits !== undefined && integerDigits === '') {
    integerDigits = '0';
  }

  const integerText = groupThousands(integerDigits);
  const decimalText = decimalDigits !== undefined ? `,${decimalDigits}` : '';

  return `${negative ? '-' : ''}${integerText}${decimalText}`;
}

/** Text to show in the field for a stored value (no exponent notation). */
export function formatNumberForInput(value?: number | null): string {
  if (value === null || value === undefined || !Number.isFinite(value)) {
    return '';
  }

  const text = Math.abs(value).toLocaleString('en-US', {
    maximumFractionDigits: 20,
    useGrouping: false
  });
  const [integerDigits, decimalDigits] = text.split('.');

  return `${value < 0 ? '-' : ''}${groupThousands(integerDigits)}${decimalDigits ? ',' + decimalDigits : ''}`;
}
