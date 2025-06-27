// Manages creating & syncing birthday events.

import { doc, serverTimestamp, setDoc, WriteBatch } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"
import { Event } from "../types/EventType";
import { useUpcomingEvents } from "./useUpcomingEvents";
import { getEventsCollection } from "../firebase/firestore";

export const useBirthdayEventManager = () => {
    const { authState } = useAuth();
    const upcomingEvents = useUpcomingEvents() as Event[];

    const syncBirthdayEvent = async (personId: string, personName: string, birthday: string, batch?: WriteBatch) => {
        console.log('TEST.  createBirthdayEvent function triggered');
    
        // Guard Clause
        if (!authState.user || !personId || !birthday || !personName) { 
            console.warn('Either userId, personId, personName, or birthday is missing. Cannot continue.');
            return;
        }

        // Check if birthday event already exists:
        const hasUpcomingBirthdayEventAlready = checkForUpcomingBirthday(personId); // Checks events dataContext for upcoming events with type 'birthday' & matching personId.
        if (hasUpcomingBirthdayEventAlready) {
            console.warn('Upcoming birthday found. Backing out.');
            return;
        }
    
        // If *upcoming* birthday event does NOT already exist... create a new event with type: birthday
        try {
            const nextBirthday = getNextBirthdayDate(birthday); // Checks today's date & whether the MM-DD has passed. Returns appropriate *next, upcoming* birthday.
    
            const newDocRef = doc(getEventsCollection(authState.user.uid));
            const data: Event = {
                id: newDocRef.id,
                title: `${personName}'s Birthday`,
                date: nextBirthday,
                people: [personId],
    
                type: 'birthday',
                recurring: true,
    
                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            // Using optional "batch" for person creation process in AddPersonModal. This way they all work, or none do.
            if (batch) {
                batch.set(newDocRef, data);
            } else {
                await setDoc(newDocRef, data);
            }
    
        } catch (error) {
            console.error('Error creating birthday event. Error:', error);
        }
    }

    // Check's whether the MM-DD has passed for current year.  If yes... returns a YYYY-MM-DD with *next year*, otherwise uses *this year*.
    const getNextBirthdayDate = (birthday: string): string => {
        const today = new Date();
        const birthDate = new Date(birthday);
    
        // Set to current year
        const nextBirthday = new Date(
            today.getFullYear(),
            birthDate.getMonth(),
            birthDate.getDate()
        )
    
        // If Date has already passed *this* year, move to next year
        if (nextBirthday <= today) {
            nextBirthday.setFullYear(today.getFullYear() + 1);
        }
    
        // Return as YYYY-MM-DD string
        return nextBirthday.toISOString().split('T')[0];
    }
    
    // Checks events data context for an upcoming event for personId & whether that event has a type of 'birthday'
    // *TODO*:  Change to personId optional.  Use this function to check ALL person's and whether they have an upcoming birthday or not.
    const checkForUpcomingBirthday = (personId: string): boolean => {
        const personEvents = upcomingEvents.filter(event => {
            event.people.includes(personId) && event.type === 'birthday'
        })

        return personEvents.length > 0;
    }

    return { syncBirthdayEvent };
}
