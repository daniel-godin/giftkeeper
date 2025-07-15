// Utility Functions That Manipulate Currency
// IMPORTANT:  This app stores currency in "cents" (as a Number) in database.

// Convert "cents" to "dollars" -- Calculations
export const centsToDollars = (cents: number): number => {
    return cents / 100;
}

// For Display Purposes - Returns Formatted String With USD ($) Sign Before
export const formatCurrency = (cents: number): string => {
    if (cents === 0 || !cents) { return `$0.00` };
    return `$${(cents / 100).toFixed(2)}`;
}