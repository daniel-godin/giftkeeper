import { describe, expect, test } from 'vitest'
import { formatBirthdayShort, getDaysUntilDate, isValidBirthday, isValidDate, isValidDateString, isValidEventDate } from './dateUtils'

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
            expect(() => getDaysUntilDate('hello world')).toThrow('Invalid date: hello world. Expected YYYY-MM-DD format')
            expect(() => getDaysUntilDate('not-a-date')).toThrow('Invalid date: not-a-date. Expected YYYY-MM-DD format')
            expect(() => getDaysUntilDate('')).toThrow('Invalid date: . Expected YYYY-MM-DD format')
        })

        test('throws for almost-correct format', () => {
            expect(() => getDaysUntilDate('2025/08/10')).toThrow('Invalid date: 2025/08/10. Expected YYYY-MM-DD format') // Wrong separators
            expect(() => getDaysUntilDate('25-08-10')).toThrow('Invalid date: 25-08-10. Expected YYYY-MM-DD format')   // 2-digit year
            expect(() => getDaysUntilDate('2025-8-10')).toThrow('Invalid date: 2025-8-10. Expected YYYY-MM-DD format')  // Missing zero padding
            expect(() => getDaysUntilDate('08-10-2025')).toThrow('Invalid date: 08-10-2025. Expected YYYY-MM-DD format') // Wrong order
        })

        test('throws for extra characters', () => {
            expect(() => getDaysUntilDate('2025-08-10T00:00:00')).toThrow('Invalid date: 2025-08-10T00:00:00. Expected YYYY-MM-DD format')
            expect(() => getDaysUntilDate('2025-08-10 ')).toThrow('Invalid date: 2025-08-10 . Expected YYYY-MM-DD format') // Trailing space
            expect(() => getDaysUntilDate(' 2025-08-10')).toThrow('Invalid date:  2025-08-10. Expected YYYY-MM-DD format') // Leading space
        })
    })

    describe('impossible dates (correct format)', () => {
        test('throws for impossible February dates', () => {
            expect(() => getDaysUntilDate('2025-02-31')).toThrow('Invalid date: 2025-02-31. Expected YYYY-MM-DD format')
            expect(() => getDaysUntilDate('2025-02-30')).toThrow('Invalid date: 2025-02-30. Expected YYYY-MM-DD format')
            expect(() => getDaysUntilDate('2025-02-29')).toThrow('Invalid date: 2025-02-29. Expected YYYY-MM-DD format') // 2025 is not leap year
        })

        test('throws for impossible months', () => {
            expect(() => getDaysUntilDate('2025-13-15')).toThrow('Invalid date: 2025-13-15. Expected YYYY-MM-DD format')
            expect(() => getDaysUntilDate('2025-00-15')).toThrow('Invalid date: 2025-00-15. Expected YYYY-MM-DD format')
            expect(() => getDaysUntilDate('2025-45-10')).toThrow('Invalid date: 2025-45-10. Expected YYYY-MM-DD format')
        })

        test('throws for impossible days', () => {
            expect(() => getDaysUntilDate('2025-01-32')).toThrow('Invalid date: 2025-01-32. Expected YYYY-MM-DD format') // January has 31 days
            expect(() => getDaysUntilDate('2025-04-31')).toThrow('Invalid date: 2025-04-31. Expected YYYY-MM-DD format') // April has 30 days
            expect(() => getDaysUntilDate('2025-01-00')).toThrow('Invalid date: 2025-01-00. Expected YYYY-MM-DD format')
            expect(() => getDaysUntilDate('2025-01-77')).toThrow('Invalid date: 2025-01-77. Expected YYYY-MM-DD format')
        })

        test('handles leap year correctly', () => {
            // 2024 IS a leap year, so Feb 29 should be valid
            expect(() => getDaysUntilDate('2024-02-29')).not.toThrow()
            
            // 2025 is NOT a leap year, so Feb 29 should throw
            expect(() => getDaysUntilDate('2025-02-29')).toThrow('Invalid date: 2025-02-29. Expected YYYY-MM-DD format')
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

// Tests for isValidBirthday
describe('isValidBirthday', () => {
  describe('valid birthday dates', () => {
        test('returns true for today', () => {
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            expect(isValidBirthday(todayString)).toBe(true);
        })

        test('returns true for past dates', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];
            
            const longAgo = new Date();
            longAgo.setFullYear(longAgo.getFullYear() - 25);
            const longAgoString = longAgo.toISOString().split('T')[0];
            
            expect(isValidBirthday(yesterdayString)).toBe(true);
            expect(isValidBirthday(longAgoString)).toBe(true);
            expect(isValidBirthday('1990-05-15')).toBe(true);
        })

        test('returns false for future dates', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowString = tomorrow.toISOString().split('T')[0];
            
            const farFuture = new Date();
            farFuture.setFullYear(farFuture.getFullYear() + 5);
            const farFutureString = farFuture.toISOString().split('T')[0];
            
            expect(isValidBirthday(tomorrowString)).toBe(false);
            expect(isValidBirthday(farFutureString)).toBe(false);
            expect(isValidBirthday('2030-12-25')).toBe(false);
        })
    })

    describe('invalid inputs', () => {
        test('returns false for empty/invalid strings', () => {
            expect(isValidBirthday('')).toBe(false);
            expect(isValidBirthday('hello')).toBe(false);
            expect(isValidBirthday('2025/05/15')).toBe(false); // Wrong format
        })

        test('returns false for impossible dates', () => {
            expect(isValidBirthday('1990-02-31')).toBe(false); // Feb 31st doesn't exist
            expect(isValidBirthday('1990-13-15')).toBe(false); // Month 13 doesn't exist
            expect(isValidBirthday('1990-04-31')).toBe(false); // April only has 30 days
        })
    })
})


// Tests for isValidEventDate
describe('isValidEventDate', () => {
  describe('valid event dates', () => {
        test('returns true for today', () => {
            const today = new Date();
            const todayString = today.toISOString().split('T')[0];
            expect(isValidEventDate(todayString)).toBe(true);
        })

        test('returns true for future dates', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            const tomorrowString = tomorrow.toISOString().split('T')[0];
            
            const farFuture = new Date();
            farFuture.setFullYear(farFuture.getFullYear() + 2);
            const farFutureString = farFuture.toISOString().split('T')[0];
            
            expect(isValidEventDate(tomorrowString)).toBe(true);
            expect(isValidEventDate(farFutureString)).toBe(true);
            expect(isValidEventDate('2030-12-25')).toBe(true);
        })

        test('returns false for past dates', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toISOString().split('T')[0];
            
            const longAgo = new Date();
            longAgo.setFullYear(longAgo.getFullYear() - 5);
            const longAgoString = longAgo.toISOString().split('T')[0];
            
            expect(isValidEventDate(yesterdayString)).toBe(false);
            expect(isValidEventDate(longAgoString)).toBe(false);
            expect(isValidEventDate('2020-01-01')).toBe(false);
        })
    })

    describe('invalid inputs', () => {
        test('returns false for empty/invalid strings', () => {
            expect(isValidEventDate('')).toBe(false);
            expect(isValidEventDate('hello')).toBe(false);
            expect(isValidEventDate('2025/05/15')).toBe(false); // Wrong format
        })

        test('returns false for impossible dates', () => {
            expect(isValidEventDate('2025-02-31')).toBe(false); // Feb 31st doesn't exist
            expect(isValidEventDate('2025-13-15')).toBe(false); // Month 13 doesn't exist
            expect(isValidEventDate('2025-04-31')).toBe(false); // April only has 30 days
        })
    })

    describe('edge cases', () => {
        test('handles leap years correctly', () => {
            // 2024 is a leap year - Feb 29 should be valid if in future/today
            // const feb29_2024 = '2024-02-29';
            // 2025 is not a leap year - Feb 29 should be invalid
            const feb29_2025 = '2025-02-29';
            
            expect(isValidEventDate(feb29_2025)).toBe(false); // Invalid date
            
            // Note: feb29_2024 test would depend on current date, so commenting out
            // expect(isValidEventDate(feb29_2024)).toBe(false or true depending on current date);
        })
    })
})

// Tests for isValidDate
// Takes in a string "YYYY-MM-DD" and tests whether it's a valid Date.
describe('isValidDate', () => {
    test('Basic validation', () => {
        expect(isValidDate("2025-05-05")).toBe(true);
        expect(isValidDate("2025-02-31")).toBe(false);
    });

    test('Wrong string syntax', () => {
        expect(isValidDate("2025-2-16")).toBe(false);
        expect(isValidDate("02-16-2025")).toBe(false);
        expect(isValidDate("2025/02/16")).toBe(false);
        expect(isValidDate("02-16")).toBe(false);
        expect(isValidDate("02/16")).toBe(false);
        expect(isValidDate("December 31st, 2025")).toBe(false);

    })
})

// Tests for isValidDateString
// Takes in a string and validates whether it follows the "YYYY-MM-DD" format.
// This does not validate whether a Date is valid, use isValidDate utility function for that.
// Will return "2025-02-31" (February 31st, 2025) as valid.
describe('isValidDateString', () => {
    test('Basic validation', () => {
        expect(isValidDateString("2025-02-16")).toBe(true);
        expect(isValidDateString("hello")).toBe(false);
    })
    test('Close, but not correct', () => {
        expect(isValidDateString("2025-2-16")).toBe(false);
        expect(isValidDateString("02-16-2025")).toBe(false);
    })
    test('Incorrect dates, but valid strings', () => {
        expect(isValidDateString("2025-02-31")).toBe(true);
        expect(isValidDateString("2025-45-66")).toBe(true);
    })
})

// Tests for formatBirthdayShort Utility Function
// Proper/Valid Input Date String:  "YYYY-MM-DD".  Returns a shortened month + day "Mar 15".
describe('formatBirthdayShort', () => {
    test('valid birthday strings', () => {
        expect(formatBirthdayShort('2000-03-15')).toBe('Mar 15');
        expect(formatBirthdayShort('1988-12-05')).toBe('Dec 5');
        expect(formatBirthdayShort('1899-09-22')).toBe('Sep 22');
    })
    
    test('invalid birthday strings', () => {
        expect(formatBirthdayShort('')).toBe('--');
        expect(formatBirthdayShort(' ')).toBe('--');
        expect(formatBirthdayShort('date')).toBe('--');
        expect(formatBirthdayShort('12-20-2000')).toBe('--');
    })

    test('edge case dates', () => {
        expect(formatBirthdayShort('2000-02-29')).toBe('Feb 29'); // Leap year
        expect(formatBirthdayShort('2000-01-31')).toBe('Jan 31'); // End of month
        expect(formatBirthdayShort('2000-04-30')).toBe('Apr 30'); // 30-day month
        expect(formatBirthdayShort('2000-02-28')).toBe('Feb 28'); // Non-leap year Feb
    })

    test('single digit days', () => {
        expect(formatBirthdayShort('2000-01-01')).toBe('Jan 1');
        expect(formatBirthdayShort('2000-07-04')).toBe('Jul 4');
    })
})

// Tests for getNextBirthdayDate
// Input: Date String ("YYYY-MM-DD").  Output:  Date String or null.
// Checks whether a MM-DD has passed for current year.  If yes, uses this year + 1, otherwise uses this year.
// describe('getNextBirthdayDate', () => {

// })

// Tests for getDaysUntilNextBirthday
// Input:  Date String ("YYYY-MM-DD").  Output: Number (0 for falsey).
// Uses getNextBirthdayDate combined with a user's birthday date input to get the days until their *next* birthday
// describe('getDaysUntilNextBirthday', () => {

// })