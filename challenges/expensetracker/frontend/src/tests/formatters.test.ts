import { formatDate, formatCurrency, formatPercentage, getCategoryColor } from '../utils/formatters';

describe('Formatters', () => {
  describe('formatDate', () => {
    it('formats a date string correctly', () => {
      const date = '2025-07-30T12:00:00.000Z';
      expect(formatDate(date)).toBe('Jul 30, 2025');
    });
    
    it('returns "Invalid date" for invalid date strings', () => {
      const invalidDate = 'not-a-date';
      expect(formatDate(invalidDate)).toBe('Invalid date');
    });
  });
  
  describe('formatCurrency', () => {
    it('formats a number as currency with $ symbol', () => {
      expect(formatCurrency(1000)).toBe('$1,000.00');
      expect(formatCurrency(99.99)).toBe('$99.99');
      expect(formatCurrency(0)).toBe('$0.00');
    });
    
    it('handles negative numbers', () => {
      expect(formatCurrency(-50)).toBe('-$50.00');
    });
  });
  
  describe('formatPercentage', () => {
    it('formats a number as a percentage with one decimal place', () => {
      expect(formatPercentage(75)).toBe('75.0%');
      expect(formatPercentage(33.333)).toBe('33.3%');
      expect(formatPercentage(0)).toBe('0.0%');
    });
  });
  
  describe('getCategoryColor', () => {
    it('returns the correct color for known categories', () => {
      expect(getCategoryColor('Food')).toBe('#4caf50');
      expect(getCategoryColor('Transport')).toBe('#2196f3');
      expect(getCategoryColor('Entertainment')).toBe('#673ab7');
      expect(getCategoryColor('Shopping')).toBe('#f44336');
      expect(getCategoryColor('Bills')).toBe('#ff9800');
    });
    
    it('returns the "Other" color for unknown categories', () => {
      expect(getCategoryColor('Unknown')).toBe('#607d8b');
    });
  });
});
