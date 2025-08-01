import { useEvents } from '../../../../contexts/EventsContext'
import { Event } from '../../../../types/EventType';
import { EventCard } from './components/EventCard/EventCard';
import styles from './EventTimeline.module.css'

interface EventTimelineProps {

}

export function EventTimeline() {
    const { events } = useEvents();

    return (
        <div className={styles.eventTimeline}>
            <header className={styles.eventTimelineHeader}>
                <h3 className={styles.eventTimelineTitle}>Event Timeline</h3>

                <div className={styles.eventTimelineControls}>
                    <button className={`unstyled-button ${styles.eventTimelineControlButton} ${styles.selected}`}>30 Days</button>
                    <button className={`unstyled-button ${styles.eventTimelineControlButton}`}>90 Days</button>
                    <button className={`unstyled-button ${styles.eventTimelineControlButton}`}>This Year</button>

                </div>                
                
            </header>

            <div className={styles.eventTimelineCardsContainer}>
                {/* events.map... use re-usable component. */}
                {events.map(event => (
                    <EventCard key={event.id} data={event} />
                ))}
            </div>
        </div>
    )
}