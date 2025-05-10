import { Timestamp } from "firebase/firestore";
import { CalendarDate } from "./CommonTypes";


interface Person {
    id: string;
    name: string;
    relationship?: string;
    birthday?: CalendarDate;
    avatar?: string; // URL to profile image
    notes?: string;

    // Additional special dates beyond birthday. Anniversary, etc.
    specialDates?: Array<{
        date: CalendarDate;
        title: string;
        recurring: boolean;
    }>

    // Gift preferences:
    preferences?: {
        likes?: string[];
        dislikes?: string[];
        sizes?: Record<string, string>; // Clothing sizes, etc.
        favoriteColors?: string[];
        interests: string[]; // Baseball, Bobbleheads, Nutcrackers, Photography, et al.
    }

    // Metadata
    createdAt: Timestamp;
    updatedAt: Timestamp;
}