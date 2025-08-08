import { centsToDollars, formatCurrency } from "./currencyUtils"
import { test, expect } from 'vitest'

test('Convert cents to dollars - basic cases', () => {
    expect(centsToDollars(10000)).toBe(100)
    expect(centsToDollars(100)).toBe(1)
    expect(centsToDollars(0)).toBe(0)
})

test('Convert cents to dollars - edge cases', () => {
    expect(centsToDollars(50)).toBe(0.5)  // Under $1
    expect(centsToDollars(1)).toBe(0.01)  // Single cent
    expect(centsToDollars(99)).toBe(0.99) // Just under $1
})

test('Convert cents to dollars - potential problem cases', () => {
    expect(centsToDollars(-100)).toBe(-1) // Negative money?
    expect(centsToDollars(12345)).toBe(123.45) // Odd amounts
})

// Tests For formatCurrency Function
test('Convert cents from number to dollar string', () => {
    expect(formatCurrency(100000)).toBe('$1,000.00');
    expect(formatCurrency(10000)).toBe('$100.00');
    expect(formatCurrency(100)).toBe('$1.00');
    expect(formatCurrency(0)).toBe('$0.00');

    expect(formatCurrency(100125)).toBe('$1,001.25');
    expect(formatCurrency(125)).toBe('$1.25');

    expect(formatCurrency(-125)).toBe('-$1.25');

    expect(formatCurrency(999999999)).toBe('$9,999,999.99');
})