import { formatPrice, calculateTotal, validateEmail } from './helpers';

describe('helpers', () => {
  describe('formatPrice', () => {
    it('formats positive price correctly', () => {
      expect(formatPrice(1234.56)).toBe('$1,234.56');
    });
    it('formats zero price', () => {
      expect(formatPrice(0)).toBe('$0.00');
    });
    it('formats negative price', () => {
      expect(formatPrice(-10)).toBe('($10.00)'); // Intl formats negative as ($10.00) in en-US
    });
  });

  describe('calculateTotal', () => {
    it('returns 0 for empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });
    it('calculates total for single item', () => {
      expect(calculateTotal([{ price: 10, quantity: 2 }])).toBe(20);
    });
    it('calculates total for multiple items', () => {
      expect(calculateTotal([
        { price: 5, quantity: 2 },
        { price: 3, quantity: 4 }
      ])).toBe(22);
    });
    it('handles negative prices and quantities', () => {
      expect(calculateTotal([
        { price: -5, quantity: 2 },
        { price: 3, quantity: -4 }
      ])).toBe(-22);
    });
  });

  describe('validateEmail', () => {
    it('returns true for valid email', () => {
      expect(validateEmail('test@example.com')).toBe(true);
    });
    it('returns false for missing @', () => {
      expect(validateEmail('testexample.com')).toBe(false);
    });
    it('returns false for missing domain', () => {
      expect(validateEmail('test@')).toBe(false);
    });
    it('returns false for missing username', () => {
      expect(validateEmail('@example.com')).toBe(false);
    });
    it('returns false for empty string', () => {
      expect(validateEmail('')).toBe(false);
    });
  });
});
