// Type(s) for the authenticated User.  Various information stored in (db, 'users', {userId})

import { FieldValue, Timestamp } from "firebase/firestore";

export interface UserProfile {
    id: string;
    // email?: string; // Not Storing Emails In Firestore

    theme?: 'light' | 'dark' | 'auto';

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}