import { FieldValue, Timestamp } from "firebase/firestore";

export interface GiftItem {
    id?: string;
    name: string;

    // Denormalized Data
    personId?: string; // For connecting to Person
    personName?: string; // For displaying in UI, reduces unneeded lookups to find name in Person.

    // Status & Associations
    status?: GiftStatus; // idea is default
    eventId?: string; // eventId that item has been 'purchased' for.
    url?: string; // URL to item. eg: amazon.com/itemURL // Possibly use referrer links

    // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
    estimatedCost?: number;
    purchasedCost?: number;

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}

export type GiftStatus = 'idea' | 'purchased'; // 'idea' is Default
export type GiftCategory = 'clothing' | 'electronics' | 'books' | 'other';
export type GiftPriority = 'low' | 'medium' | 'high';