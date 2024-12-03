import { Currency, ZERO_DECIMAL_CURRENCIES } from '../../src/types/currencies';

describe('Currency Utilities', () => {
  it('should expose the Currency enum with all supported currencies', () => {
    const allCurrencies = Object.values(Currency);

    expect(allCurrencies).toContain(Currency.USD);
    expect(allCurrencies).toContain(Currency.JPY);
    expect(allCurrencies).toContain(Currency.EUR);
    expect(allCurrencies).not.toContain('INVALID');
    expect(allCurrencies.length).toBeGreaterThan(0);
  });

  it('should correctly identify zero-decimal currencies', () => {
    const zeroDecimalCurrencies = ZERO_DECIMAL_CURRENCIES;

    expect(zeroDecimalCurrencies.has(Currency.JPY)).toBe(true); // JPY is zero-decimal
    expect(zeroDecimalCurrencies.has(Currency.USD)).toBe(false); // USD is not zero-decimal
    expect(zeroDecimalCurrencies.has(Currency.EUR)).toBe(false); // EUR is not zero-decimal
    expect(zeroDecimalCurrencies.size).toBeGreaterThan(0);
  });

  it('should allow validation of unsupported currencies', () => {
    const isSupportedCurrency = (currency: string): boolean => {
      return Object.values(Currency).includes(currency as Currency);
    };

    expect(isSupportedCurrency('XYZ')).toBe(false); // XYZ is not a supported currency
    expect(isSupportedCurrency('USD')).toBe(true); // USD is supported
  });

  it('should correctly validate zero-decimal currencies dynamically', () => {
    const isZeroDecimalCurrency = (currency: string): boolean => {
      return ZERO_DECIMAL_CURRENCIES.has(currency as Currency);
    };

    expect(isZeroDecimalCurrency('XYZ')).toBe(false); // XYZ is not zero-decimal
    expect(isZeroDecimalCurrency('JPY')).toBe(true); // JPY is zero-decimal
    expect(isZeroDecimalCurrency('USD')).toBe(false); // USD is not zero-decimal
    expect(isZeroDecimalCurrency('EUR')).toBe(false); // EUR is not zero-decimal
  });
});
