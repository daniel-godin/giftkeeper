import { FieldValue, Timestamp } from "firebase/firestore";

export interface Event {
    id?: string;
    title: string;
    date: string; // Possibly add a "DateRange" for events that last multiple days.
    type?: string; // Birthday, Holiday, Anniversary, etc.
    personId?: string; // If connecting to a "Person" from (db, 'users', UUID, 'people', personId);
    recurring?: boolean; // Annual recurring events like birthdays.
    notes?: string;

    // Metadata
    createdAt?: Timestamp | FieldValue;
    updatedAt?: Timestamp | FieldValue;
}