// Manages creating & syncing birthday events.
import { doc, serverTimestamp, setDoc, updateDoc, WriteBatch } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext"
import { Event } from "../types/EventType";
import { useUpcomingEvents } from "./useUpcomingEvents";
import { getEventDocRef, getEventsCollRef } from "../firebase/firestore";
import { DEFAULT_EVENT } from "../constants/defaultObjects";
import { devError, devLog, devWarn } from "../utils/logger";
import { getNextBirthdayDate } from "../utils";

export const useBirthdayEventManager = () => {
    const { authState } = useAuth();
    const upcomingEvents = useUpcomingEvents() as Event[];

    // Dispatcher Function
    const syncBirthdayEvent = async (personId: string, personName: string, birthday: string, batch?: WriteBatch) => {
        // Guard Clause
        if (!authState.user || !personId || !birthday || !personName) { 
            devWarn('Either userId, personId, personName, or birthday is missing. Cannot continue.')
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
                ...DEFAULT_EVENT,
                id: newDocRef.id,
                title: `${personName}'s Birthday`,
                date: nextBirthday || '',
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

            devLog(`Sucessfully created ${data.title} event!`);
        } catch (error) {
            devError('Error in createBirthdayEvent. Error:', error);
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

            // Using optional "batch" for person creation process in AddPersonModal. This way they all work, or none do.
            if (batch) {
                batch.update(docRef, updatedData);
            } else {
                await updateDoc(docRef, updatedData);
            }

            devLog(`Sucessfully updated ${personName}'s event!`);
        } catch (error) {          
            devError('Error in updateBirthdayEvent. Error:', error);
        }
    }

    const findUpcomingBirthdayEvent = (personId: string): Event | null => {
        const birthdayEvents = upcomingEvents.filter(event => {
            return event.people.includes(personId) && event.type === 'birthday'
        })

        return birthdayEvents.length > 0 ? birthdayEvents[0] : null;
    }

    return { syncBirthdayEvent };
}
