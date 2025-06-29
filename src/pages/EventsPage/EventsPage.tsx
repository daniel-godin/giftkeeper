import { useState } from 'react';
import styles from './EventsPage.module.css'
import { Link } from 'react-router';
import { AddEventModal } from '../../components/modals/AddEventModal/AddEventModal';
import { useEvents } from '../../contexts/EventsContext';
import { useUpcomingEvents } from '../../hooks/useUpcomingEvents';

export function EventsPage () {
    // IMPORTANT NOTE:
    // Currently *ONLY* displaying "upcomingEvents".  Need a way to display *ALL* events later.

    const { events, loading: loadingEvents } = useEvents();
    const upcomingEvents = useUpcomingEvents();

    const [isAddNewEventModalOpen, setIsAddNewEventModalOpen] = useState<boolean>(false);

    return (
        <section className={styles.eventsPage}>
            <h1>Events</h1>

            <button className={styles.addEventButton} onClick={() => setIsAddNewEventModalOpen(true)}>Add Event</button>

            <div className={styles.eventsContainer}>
                {loadingEvents ? (
                    <div className={styles.loadingMessage}>Loading events...</div>
                ) : (
                    <div className={styles.eventsGrid}>
                        {upcomingEvents.length === 0 ? (
                            <div>No events added yet.  Create an Event to get started!</div>
                        ) : (
                            upcomingEvents.map((event) => (
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