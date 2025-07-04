import { FieldValue, Timestamp } from "firebase/firestore";


export const formatFirestoreDate = (
    date: Timestamp | FieldValue | undefined, 
    format: 'short' | 'long' | 'iso' = 'short'
) : string => {
    if (!date) { return 'No date available'; };

    if (date instanceof Timestamp) {
        const jsDate = date.toDate();

        switch (format) {
            case 'iso':
                return jsDate.toISOString();
            case 'long':
                return jsDate.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            case 'short':
            default:
                return jsDate.toLocaleDateString();
        }
    }

    // Fallback response:
    return "Date pending...";
}

export const getDaysUntilDate = (date: string) => {
    // date string should be either 'yyyy-mm-dd' or '1900-mm-dd' 1900 being default/fake year.

    const formattedDate = new Date(date);
    const today = new Date();
    const currentYear = today.getFullYear();

    // Always use current year for countdown, regardless of stored year
    const nextBirthday = new Date(currentYear, formattedDate.getMonth(), formattedDate.getDate());

    if (nextBirthday < today) {
        nextBirthday.setFullYear(currentYear + 1);
    }

    const diffTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}