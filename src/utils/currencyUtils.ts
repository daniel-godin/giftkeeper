// Utility Functions That Manipulate Currency
// IMPORTANT:  This app stores currency in "cents" (as a Number) in database.

// Convert "cents" to "dollars" -- Calculations
export const centsToDollars = (cents: number): number => {
    return cents / 100;
}

// For Display Purposes - Returns Formatted String With USD ($) Sign Before
// Note:  Always returns with cents as well (example: "$1,015.00"), even if ".00"
export const formatCurrency = (cents: number): string => {
    const formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    })
    const convertToDollars = cents / 100;
    const formatted = formatter.format(convertToDollars);
    return formatted;
}