import { FieldValue, Timestamp } from "firebase/firestore";


export interface GiftList {
    id?: string;
    title: string;
    // Add more here later.

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}

export interface GiftItem {
    id?: string;
    giftListId?: string; // Gift List ID that this Item belongs to.
    name: string;

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
    
    // This is v1.  Add more later.
}