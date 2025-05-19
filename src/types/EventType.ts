import { FieldValue, Timestamp } from "firebase/firestore";
import { CalendarDate } from "./CommonTypes";


export interface Event {
    id: string;
    title: string;
    date: CalendarDate; // Possibly add a "DateRange" for events that last multiple days.
    type?: string; // Birthday, Holiday, Anniversary, etc.
    personId?: string; // If connecting to a "Person" from (db, 'users', UUID, 'people', personId);
    recurring?: boolean; // Annual recurring events like birthdays.
    notes?: string;

    // Metadata
    createdAt: Timestamp | FieldValue;
    updatedAt: Timestamp | FieldValue;
}

export interface TempEvent {
    id: string;
    title: string;
    date: string;

    // Metadata
    createdAt: Timestamp | FieldValue;
    updatedAt: Timestamp | FieldValue;
}