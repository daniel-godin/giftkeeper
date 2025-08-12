import { test, describe, expect } from 'vitest'
import { capitalizeFirst } from './stringUtils'

// Tests for "capitalizeFirst" function.
// Takes in a string and capitalizes the first character, with lowerCase for all other characters.
describe('capitalizeFirst', () => {
    describe('success strings', () => {
        test('capitalize name', () => {
            expect(capitalizeFirst('daniel')).toBe('Daniel');
            expect(capitalizeFirst('michael jordan')).toBe('Michael jordan');
            expect(capitalizeFirst('tiger Woods')).toBe('Tiger woods');
            expect(capitalizeFirst('HELLO')).toBe('Hello');
        })
        test('edge cases', () => {
            expect(capitalizeFirst('')).toBe('');
            expect(capitalizeFirst(' ')).toBe(' ');
            expect(capitalizeFirst('  Hello')).toBe('  hello')
            expect(capitalizeFirst('@daniel')).toBe('@daniel');
            expect(capitalizeFirst('d')).toBe('D');
            expect(capitalizeFirst('adsfffadfasdfasdfsadffda fd asdf sadfdafa ds fda sd')).toBe('Adsfffadfasdfasdfsadffda fd asdf sadfdafa ds fda sd');
        })
    })
})