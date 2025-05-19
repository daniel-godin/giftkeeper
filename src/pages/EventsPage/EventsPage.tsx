import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './EventsPage.module.css'
import { TempEvent } from '../../types/EventType';
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export function EventsPage () {
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<TempEvent[]>([]);

    const [newEvent, setNewEvent] = useState({title: '', date: '' })
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        // Guard Clause
        if (!authState.user) {
            setEvents([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Firestore Queries
        const eventsRef = collection(db, 'users', authState.user.uid, 'events');
        const peopleQuery = query(eventsRef, orderBy('date')); // Sorts by date

        const unsubscribe = onSnapshot(peopleQuery, (snapshot) => {
            const eventsList: TempEvent[] = [];
            snapshot.forEach((doc) => {
                eventsList.push(doc.data() as TempEvent);
            })
            setEvents(eventsList);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching people:', error);
            setIsLoading(false);
        })

        return () => unsubscribe();
    }, [])


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setNewEvent({
            ...newEvent,
            [name]: value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guard Clauses:
        if (!newEvent || !newEvent.title || !newEvent.date) { console.warn('Must include both title & date'); return; };
        if (!authState.user) { return; };

        setIsSubmitting(true);
        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'events'))
            const newEventObject: TempEvent = {
                id: newDocRef.id,
                title: newEvent.title,
                date: newEvent.date, // I need to use either a basic ISO string, or use my custom CalendarDate object.

                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newEventObject);

            console.log(`New Event (${newEvent.title}) created on ${newEvent.date}.`)
            setNewEvent({ title: '', date: '' });

        } catch (error) {
            console.error('Error submitting new event. Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <section className={styles.eventsPage}>
            <h1>Events</h1>

            <form className={styles.formCreateEvent} onSubmit={handleSubmit} autoComplete='off'>
                <label className={styles.label}>Event Title:
                    <input
                        type='text'
                        name='title'
                        required={true}
                        value={newEvent.title}
                        onChange={handleInputChange}
                    />
                </label>

                <label className={styles.label}>Date:
                    <input
                        type='date'
                        name='date'
                        required={true}
                        value={newEvent.date}
                        onChange={handleInputChange}
                    />
                </label>

                <button className={styles.button}>{isSubmitting ? (<>Creating New Event...</>) : (<>Create New Event</>)}</button>
            </form>

            <div className={styles.eventsContainer}>
                {isLoading ? (
                    <div className={styles.loadingMessage}>Loading events...</div>
                ) : (
                    <div className={styles.eventsGrid}>
                        {events.length === 0 ? (
                            <div>No events added yet.  Create an Event to get started!</div>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className={styles.eventCard}>
                                    {event.title} ({event.date})
                                </div>
                            ))
                        )}
                    </div>  
                )}
            </div>
        </section>
    )
}