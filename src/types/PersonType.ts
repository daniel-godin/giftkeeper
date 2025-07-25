import { FieldValue, Timestamp } from "firebase/firestore";

export interface Person {
    id?: string;
    name: string;

    // Important Optional Data
    birthday?: string;

    // Optional Data
    notes?: string;
    relationship?: string;

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}