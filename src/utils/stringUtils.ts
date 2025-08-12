// Utility Functions That Manipulate Strings

// Capitalizes First Word ONLY
export const capitalizeFirst = (str: string): string => {
    if (!str) { return str }; // Guard Clause -- Returns Incoming String.
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}