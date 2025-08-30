import styles from './EventsPage.module.css'
import { useViewport } from '../../contexts/ViewportContext';
import { EventsHeader } from './components/EventsHeader/EventsHeader';
import { EventsFilterSort } from './components/EventsFilterSort/EventsFilterSort';
import { useEventsFiltered } from '../../hooks/useEventsFiltered';
import { EventsTable } from './components/EventsTable/EventsTable';
import { EventsList } from './components/EventsList/EventsList';

export function EventsPage () {
    // IMPORTANT NOTE:
    // Need a way to display *ALL* events, vs. "upcoming" events.

    const deviceType = useViewport();
    const { sortOptions, setSortOptions, filteredEvents, giftStatsByEvent } = useEventsFiltered();


    return (
        <section className={styles.eventsPage}>

            <EventsHeader />

            {/* Events Filtering & Sorting */}
            <EventsFilterSort
                sortOptions={sortOptions}
                setSortOptions={setSortOptions}
            />

            {/* Load EventsTable if user screen is above 768px */}
            {deviceType === 'desktop' && ( 
                <EventsTable
                    events={filteredEvents}
                    giftStatsByPerson={giftStatsByEvent}
                /> 
            )}

            {/* Load EventsList if user screen is below 768px */}
            {deviceType === 'mobile' && ( 
                <EventsList 
                    events={filteredEvents}
                    giftStatsByPerson={giftStatsByEvent}
                /> 
            )}

        </section>
    )

    // return (
    //     <section className={styles.eventsPage}>
    //         <h1>Events</h1>

    //         <button className={styles.addEventButton} onClick={() => setIsAddNewEventModalOpen(true)}>Add Event</button>

    //         <div className={styles.eventsContainer}>
    //             {loadingEvents ? (
    //                 <div className={styles.loadingMessage}>Loading events...</div>
    //             ) : (
    //                 <div className={styles.eventsGrid}>
    //                     {upcomingEvents.length === 0 ? (
    //                         <div>No events added yet.  Create an Event to get started!</div>
    //                     ) : (
    //                         upcomingEvents.map((event) => (
    //                             <Link to={`/events/${event.id}`} key={event.id} className={styles.eventCard}>
    //                                 <div className={styles.eventInfo}>
    //                                     <div className={styles.eventTitle}>{event.title}</div>
    //                                     <div className={styles.eventDate}>
    //                                         Event Date: {event.date ? (event.date) : (<span className={styles.noDateText}>No Date Set</span>)}
    //                                     </div>
    //                                 </div>
    //                             </Link>
    //                         ))
    //                     )}
    //                 </div>  
    //             )}
    //         </div>

    //         <AddEventModal
    //             isOpen={isAddNewEventModalOpen}
    //             onClose={() => setIsAddNewEventModalOpen(false)}
    //         />
            
    //     </section>
    // )
}