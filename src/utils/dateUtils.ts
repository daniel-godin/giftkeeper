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