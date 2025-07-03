// Utility Functions That Manipulate Strings

// Capitalizes First Word ONLY
export const capitalizeFirst = (str: string): string => {
    if (!str) { return str }; // Guard Clause -- Returns Incoming String.
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Capitalizes First Letter of Each Word
export const capitalizeWords = (str: string): string => {
    if (!str) { return str }; // Guard Clause -- Returns Incoming String.
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

// Removes Excess & Lowercase Everything
export const sanitizeStringAllLowerCase = (str: string): string => {
    if (!str) { return str }; // Guard Clause -- Returns Incoming String.
    return str.trim().toLowerCase();
}