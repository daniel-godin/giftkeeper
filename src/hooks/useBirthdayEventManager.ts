// Manages creating & syncing birthday events.

import { doc, serverTimestamp, setDoc, updateDoc, WriteBatch } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"
import { Event } from "../types/EventType";
import { useUpcomingEvents } from "./useUpcomingEvents";
import { getEventDocRef, getEventsCollRef } from "../firebase/firestore";

export const useBirthdayEventManager = () => {
    const { authState } = useAuth();
    const upcomingEvents = useUpcomingEvents() as Event[];

    // Dispatcher Function
    const syncBirthdayEvent = async (personId: string, personName: string, birthday: string, batch?: WriteBatch) => {
        // Guard Clause
        if (!authState.user || !personId || !birthday || !personName) { 
            console.warn('Either userId, personId, personName, or birthday is missing. Cannot continue.');
            return;
        }

        // Checks whether an existing birthday event exists in upcomingEvents.  If yes: returns data object, if no: returns null.
        const existingBirthdayEvent = findUpcomingBirthdayEvent(personId);

        // No Birthday Event Exists, Create New Birthday Event Document in events collection.
        if (!existingBirthdayEvent && personName && birthday) {
            return createBirthdayEvent(authState.user.uid, personId, personName, birthday, batch);
        }

        // Existing Event Exists.  Update Event With New Birthday and/or Name.
        if (existingBirthdayEvent && existingBirthdayEvent.id && personName && birthday) {
            return updateBirthdayEvent(authState.user.uid, existingBirthdayEvent.id, personName, birthday, batch);
        }
    }

    // Creates a new birthday event in events collection.
    const createBirthdayEvent = async (userId: string, personId: string, personName: string, birthday: string, batch?: WriteBatch) => {
        try {
            const nextBirthday = getNextBirthdayDate(birthday); // Checks today's date & whether the MM-DD has passed. Returns appropriate *next, upcoming* birthday.

            const newDocRef = doc(getEventsCollRef(userId));
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

            console.log('Creating birthday event for:', personName, 'on', nextBirthday);

            // Using optional "batch" for person creation process in AddPersonModal. This way they all work, or none do.
            if (batch) {
                batch.set(newDocRef, data);
            } else {
                await setDoc(newDocRef, data);
            }

            console.log('Birthday Event Created:', data);
        } catch (error) {
            console.error('Error in createBirthdayEvent. Error:', error);
        }
    }

    // Updates an existing birthday event in events collection.
    const updateBirthdayEvent = async (userId: string, existingEventId: string, personName: string, birthday: string, batch?: WriteBatch) => {
        try {
            const nextBirthday = getNextBirthdayDate(birthday); // Checks today's date & whether the MM-DD has passed. Returns appropriate *next, upcoming* birthday.

            const docRef = getEventDocRef(userId, existingEventId);
            const updatedData = {
                title: `${personName}'s Birthday`,
                date: nextBirthday,
                updatedAt: serverTimestamp() // Only needs updatedAt beacuse this is an updating function, not a creation of document function
            };

            console.log('Updating birthday event for:', personName);

            // Using optional "batch" for person creation process in AddPersonModal. This way they all work, or none do.
            if (batch) {
                batch.update(docRef, updatedData);
            } else {
                await updateDoc(docRef, updatedData);
            }

            console.log('Birthday Event Updated:', updatedData);
        } catch (error) {
            console.error('Error in updateBirthdayEvent. Error:', error);
        }
    }

    // Check's whether the MM-DD has passed for current year.  If yes... returns a YYYY-MM-DD with *next year*, otherwise uses *this year*.
    const getNextBirthdayDate = (birthday: string): string => {
        const today = new Date();

        // Parse the date components to avoid timezone issues
        const [originalYear, originalMonth, originalDay] = birthday.split('-').map(Number);

        // Create date using locale timezone (remember, month is 0-indexed)
        const birthDate = new Date(originalYear, originalMonth - 1, originalDay);
    
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

        // Manually format to avoid timezone issues
        const year = nextBirthday.getFullYear();
        const month = String(nextBirthday.getMonth() + 1).padStart(2, '0');
        const day = String(nextBirthday.getDate()).padStart(2, '0');

        // Return as YYYY-MM-DD string
        return `${year}-${month}-${day}`;
    }

    const findUpcomingBirthdayEvent = (personId: string): Event | null => {
        const birthdayEvents = upcomingEvents.filter(event => {
            return event.people.includes(personId) && event.type === 'birthday'
        })

        return birthdayEvents.length > 0 ? birthdayEvents[0] : null;
    }

    return { syncBirthdayEvent };
}
