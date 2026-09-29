import {
  formatNumberForInput,
  formatTypedNumber,
  parseNumberInput
} from './number-input.helper';

describe('parseNumberInput (Vietnamese number format)', () => {
  it('reads dots as thousands separators', () => {
    expect(parseNumberInput('1.000.000')).toBe(1000000);
    expect(parseNumberInput('1.000')).toBe(1000);
    expect(parseNumberInput('25.000.000.000')).toBe(25000000000);
  });

  it('reads the comma as the decimal separator', () => {
    expect(parseNumberInput('1.234,56')).toBe(1234.56);
    expect(parseNumberInput('0,5')).toBe(0.5);
    expect(parseNumberInput('12,')).toBe(12);
  });

  it('accepts a pasted number with a single decimal dot (e.g. 1000.5)', () => {
    expect(parseNumberInput('1000.5')).toBe(1000.5);
    expect(parseNumberInput('0.25')).toBe(0.25);
  });

  it('accepts negative numbers and plain digits', () => {
    expect(parseNumberInput('-1.500')).toBe(-1500);
    expect(parseNumberInput('42')).toBe(42);
  });

  it('returns null for empty or non numeric text', () => {
    expect(parseNumberInput('')).toBeNull();
    expect(parseNumberInput('   ')).toBeNull();
    expect(parseNumberInput('abc')).toBeNull();
    expect(parseNumberInput('-')).toBeNull();
  });
});

describe('formatTypedNumber (live formatting while the user types)', () => {
  it('groups the integer part with dots', () => {
    expect(formatTypedNumber('1000000')).toBe('1.000.000');
    expect(formatTypedNumber('1.000.0000')).toBe('10.000.000');
    expect(formatTypedNumber('999')).toBe('999');
  });

  it('keeps the comma and the decimals the user typed', () => {
    expect(formatTypedNumber('12345,6')).toBe('12.345,6');
    expect(formatTypedNumber('1,')).toBe('1,');
    expect(formatTypedNumber('1,2,3')).toBe('1,23');
  });

  it('treats a dot typed after a leading zero as the decimal separator', () => {
    expect(formatTypedNumber('0.')).toBe('0,');
    expect(formatTypedNumber('0.5')).toBe('0,5');
    expect(formatTypedNumber('.5')).toBe('0,5');
  });

  it('removes leading zeros and characters that are not part of a number', () => {
    expect(formatTypedNumber('00012')).toBe('12');
    expect(formatTypedNumber('12abc3')).toBe('123');
    expect(formatTypedNumber('')).toBe('');
  });

  it('keeps a leading minus sign', () => {
    expect(formatTypedNumber('-5000')).toBe('-5.000');
    expect(formatTypedNumber('-')).toBe('-');
  });
});

describe('formatNumberForInput (show a stored value in the field)', () => {
  it('formats integers and decimals in Vietnamese style', () => {
    expect(formatNumberForInput(1234567)).toBe('1.234.567');
    expect(formatNumberForInput(1234567.89)).toBe('1.234.567,89');
    expect(formatNumberForInput(0.5)).toBe('0,5');
    expect(formatNumberForInput(0)).toBe('0');
  });

  it('never uses exponent notation for tiny crypto quantities', () => {
    expect(formatNumberForInput(0.000001)).toBe('0,000001');
    expect(formatNumberForInput(0.00000001)).toBe('0,00000001');
  });

  it('formats negative numbers and returns an empty string for missing values', () => {
    expect(formatNumberForInput(-2500)).toBe('-2.500');
    expect(formatNumberForInput(null)).toBe('');
    expect(formatNumberForInput(undefined)).toBe('');
    expect(formatNumberForInput(Number.NaN)).toBe('');
  });
});
