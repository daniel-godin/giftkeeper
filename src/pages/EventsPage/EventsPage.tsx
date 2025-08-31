import styles from './EventsPage.module.css'
import { useViewport } from '../../contexts/ViewportContext';
import { EventsHeader } from './components/EventsHeader/EventsHeader';
import { EventsFilterSort } from './components/EventsFilterSort/EventsFilterSort';
import { useEventsFiltered } from '../../hooks/useEventsFiltered';
import { EventsTable } from './components/EventsTable/EventsTable';
import { EventsList } from './components/EventsList/EventsList';

export function EventsPage () {
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
                    giftStatsByEvent={giftStatsByEvent}
                /> 
            )}

            {/* Load EventsList if user screen is below 768px */}
            {deviceType === 'mobile' && ( 
                <EventsList 
                    events={filteredEvents}
                    giftStatsByEvent={giftStatsByEvent}
                /> 
            )}

        </section>
    )
}