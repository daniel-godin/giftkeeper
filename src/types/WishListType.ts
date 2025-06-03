import { FieldValue, Timestamp } from "firebase/firestore";

export interface WishList {
    id?: string;
    title: string;
    // Add more here later.

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}

export interface WishItem {
    id?: string;
    wishListId?: string; // WishList ID that this Item belongs to.
    name: string;

    // Details
    purchased?: boolean;

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}