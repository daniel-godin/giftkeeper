import { FieldValue, Timestamp } from "firebase/firestore";

export interface GiftList {
    id?: string;
    title: string;

    // Associations
    personId?: string; // Person that this GiftList belongs to.  Optional to accomadate *unknown items* list.

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}

export interface GiftItem {
    id?: string;
    name: string;

    // Status & Associations
    giftListId?: string; // Gift List ID that this Item belongs to.
    status?: 'idea' | 'purchased'; // idea is default.
    eventId?: string; // eventId that item has been 'purchased' for.

    // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
    estimatedCost?: number;
    purchasedCost?: number;

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}