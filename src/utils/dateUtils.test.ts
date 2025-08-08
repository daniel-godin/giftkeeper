import { describe, expect, test } from 'vitest'
import { getDaysUntilDate } from './dateUtils'

// Tests For getDaysUntilDate
describe('getDaysUntilDate', () => {
    describe('valid dates', () => {
        test('Returns 0 for today', () => {
            const today = new Date();
            const todayString = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
            expect(getDaysUntilDate(todayString)).toBe(0);
        })

        test('Returns positive numbers for future dates', () => {
            const tomorrow = new Date()
            tomorrow.setDate(tomorrow.getDate() + 1)
            const tomorrowString = tomorrow.toISOString().split('T')[0]
            
            expect(getDaysUntilDate(tomorrowString)).toBe(1)
        })

        test('returns negative numbers for past dates', () => {
            const yesterday = new Date()
            yesterday.setDate(yesterday.getDate() - 1)
            const yesterdayString = yesterday.toISOString().split('T')[0]
            
            expect(getDaysUntilDate(yesterdayString)).toBe(-1)
        })
    })

    describe('invalid date format', () => {
        test('throws for completely wrong format', () => {
            expect(() => getDaysUntilDate('hello world')).toThrow('Invalid date format')
            expect(() => getDaysUntilDate('not-a-date')).toThrow('Invalid date format')
            expect(() => getDaysUntilDate('')).toThrow('Invalid date format')
        })

        test('throws for almost-correct format', () => {
            expect(() => getDaysUntilDate('2025/08/10')).toThrow('Invalid date format') // Wrong separators
            expect(() => getDaysUntilDate('25-08-10')).toThrow('Invalid date format')   // 2-digit year
            expect(() => getDaysUntilDate('2025-8-10')).toThrow('Invalid date format')  // Missing zero padding
            expect(() => getDaysUntilDate('08-10-2025')).toThrow('Invalid date format') // Wrong order
        })

        test('throws for extra characters', () => {
            expect(() => getDaysUntilDate('2025-08-10T00:00:00')).toThrow('Invalid date format')
            expect(() => getDaysUntilDate('2025-08-10 ')).toThrow('Invalid date format') // Trailing space
            expect(() => getDaysUntilDate(' 2025-08-10')).toThrow('Invalid date format') // Leading space
        })
    })

    describe('impossible dates (correct format)', () => {
        test('throws for impossible February dates', () => {
            expect(() => getDaysUntilDate('2025-02-31')).toThrow('Invalid date: 2025-02-31')
            expect(() => getDaysUntilDate('2025-02-30')).toThrow('Invalid date: 2025-02-30')
            expect(() => getDaysUntilDate('2025-02-29')).toThrow('Invalid date: 2025-02-29') // 2025 is not leap year
        })

        test('throws for impossible months', () => {
            expect(() => getDaysUntilDate('2025-13-15')).toThrow('Invalid date: 2025-13-15')
            expect(() => getDaysUntilDate('2025-00-15')).toThrow('Invalid date: 2025-00-15')
            expect(() => getDaysUntilDate('2025-45-10')).toThrow('Invalid date: 2025-45-10')
        })

        test('throws for impossible days', () => {
            expect(() => getDaysUntilDate('2025-01-32')).toThrow('Invalid date: 2025-01-32') // January has 31 days
            expect(() => getDaysUntilDate('2025-04-31')).toThrow('Invalid date: 2025-04-31') // April has 30 days
            expect(() => getDaysUntilDate('2025-01-00')).toThrow('Invalid date: 2025-01-00')
            expect(() => getDaysUntilDate('2025-01-77')).toThrow('Invalid date: 2025-01-77')
        })

        test('handles leap year correctly', () => {
            // 2024 IS a leap year, so Feb 29 should be valid
            expect(() => getDaysUntilDate('2024-02-29')).not.toThrow()
            
            // 2025 is NOT a leap year, so Feb 29 should throw
            expect(() => getDaysUntilDate('2025-02-29')).toThrow('Invalid date: 2025-02-29')
        })
    })

    describe('edge cases that should work', () => {
        test('handles end-of-month dates correctly', () => {
            expect(() => getDaysUntilDate('2025-01-31')).not.toThrow() // January 31st
            expect(() => getDaysUntilDate('2025-04-30')).not.toThrow() // April 30th
            expect(() => getDaysUntilDate('2025-02-28')).not.toThrow() // Feb 28 in non-leap year
        })
    })
})
