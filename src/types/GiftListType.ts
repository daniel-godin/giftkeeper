import { FieldValue, Timestamp } from "firebase/firestore";


export interface GiftList {
    id?: string;
    title: string;
    // Add more here later.

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}