import { FieldValue, Timestamp } from "firebase/firestore";

export interface Event {
    id?: string;
    title: string;

    // Associations
    people: string[]; // Could rename.  All people invited to this event.

    // Event Details
    date: string; // Possibly add a "DateRange" for events that last multiple days.
    type?: EventTypes; // Birthday, Holiday, Anniversary, etc.
    recurring?: boolean; // Annual recurring events like birthdays.

    // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
    budget?: number; // Total budget for this event (eg. $1,000 for Christmas 2025)

    // Extra Data
    notes?: string;

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}

export type EventTypes = 'birthday' | '';

// Sorting options for events
export type EventsSortByOptions = 'title' | 'type' | 'date' | 'giftCount' | 'totalSpent' | 'recentlyAdded';

export interface EventsSortOptions {
    sortBy: EventsSortByOptions;
    sortDirection: 'asc' | 'desc';
    searchTerm: string; // For "quick" type searching for an event.
}