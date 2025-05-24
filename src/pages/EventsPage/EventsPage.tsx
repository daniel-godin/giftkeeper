import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './EventsPage.module.css'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Link } from 'react-router';
import { Event } from '../../types/EventType';
import { AddEventModal } from '../../components/modals/AddEventModal/AddEventModal';

export function EventsPage () {
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [events, setEvents] = useState<Event[]>([]);

    const [isAddNewEventModalOpen, setIsAddNewEventModalOpen] = useState<boolean>(false);

    // Firestore onSnapshot Listener for collection(db, 'users', {userId}, 'events')
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
        const eventsQuery = query(eventsRef, orderBy('title'));

        const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            const eventsList: Event[] = [];
            snapshot.forEach((doc) => {
                eventsList.push(doc.data() as Event);
            })
            setEvents(eventsList);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching events:', error);
            setIsLoading(false);
        })

        return () => unsubscribe();
    }, [])

    return (
        <section className={styles.eventsPage}>
            <h1>Events</h1>

            <button className={styles.addEventButton} onClick={() => setIsAddNewEventModalOpen(true)}>Add Event</button>

            <div className={styles.eventsContainer}>
                {isLoading ? (
                    <div className={styles.loadingMessage}>Loading events...</div>
                ) : (
                    <div className={styles.eventsGrid}>
                        {events.length === 0 ? (
                            <div>No events added yet.  Create an Event to get started!</div>
                        ) : (
                            events.map((event) => (
                                <Link to={`/events/${event.id}`} key={event.id} className={styles.eventCard}>
                                    <div className={styles.eventInfo}>
                                        <div className={styles.eventTitle}>{event.title}</div>
                                        <div className={styles.eventDate}>
                                            Event Date: {event.date ? (event.date) : (<span className={styles.noDateText}>No Date Set</span>)}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>  
                )}
            </div>

            <AddEventModal
                isOpen={isAddNewEventModalOpen}
                onClose={() => setIsAddNewEventModalOpen(false)}
            />
            
        </section>
    )
}