// URL Utility Functions

// Note:  This is very basic and quite permissive
export const sanitizeURL = (url: string): string => {
    if (!url) { return '' }; // Guard, if falsey, return empty string

    try {
        const urlToTest = url.startsWith('http') ? url : `http://${url}`;
        new URL(urlToTest);
        return urlToTest
    } catch {
        return ''; // Invalid URL
    }
}
