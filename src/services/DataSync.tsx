import { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext"
import { useEvents } from "../contexts/EventsContext";
import { usePeople } from "../contexts/PeopleContext";
import { useBirthdayEventManager } from "../hooks/useBirthdayEventManager";
import { writeBatch } from "firebase/firestore";
import { db } from "../firebase/firebase";

export function DataSync({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();
    const { people } = usePeople();
    const { loading: eventsLoading } = useEvents();
    const { syncBirthdayEvent } = useBirthdayEventManager();

    // Birthday Events Syncing
    useEffect(() => {
        if (!authState.user || people.length === 0 || eventsLoading) { return }; // Guard Clause

        const lastCheck = localStorage.getItem('lastBirthdayEventCheck');
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

        // Early Guard Clause For Better Performance.
        if (lastCheck && lastCheck >= today) { return }; // No need to run sync functions if already checked today.

        const checkAndSyncBirthdays = async () => {
            try {
                const batch = writeBatch(db);

                console.log('Birthday sync started for', people.length, 'people');

                // Loop through all people, only check birthday sync if a birthday is in the data.
                for (const person of people) {
                    if (!person.birthday || !person.id || !person.name) { continue }; // Guard Clause.  No birthday, id, or name === No need to sync

                    await syncBirthdayEvent(person.id, person.name, person.birthday, batch);
                }

                await batch.commit();

                console.log('Birthday sync completed successfully');

                localStorage.setItem('lastBirthdayEventCheck', today);
            } catch (error) {
                console.error('Error in checkAndSyncBirthdays. Error:', error);
            } 
        }

        checkAndSyncBirthdays();

    }, [authState.user?.uid, people.length, eventsLoading]); 

    return (
        <>
            {children}  
        </>
    )
}