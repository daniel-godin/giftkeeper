import { useState } from 'react';
import { EventCard } from './components/EventCard/EventCard';
import styles from './EventTimeline.module.css'
import { useUpcomingEvents } from '../../../../hooks/useUpcomingEvents';

export function EventTimeline() {
    const [selectedPeriod, setSelectedPeriod] = useState<'30days' | '90days' | 'thisyear'>('thisyear');
    const events = useUpcomingEvents(undefined, selectedPeriod);

    return (
        <div className={styles.eventTimeline}>
            <header className={styles.eventTimelineHeader}>
                <h3 className={styles.eventTimelineTitle}>Event Timeline</h3>

                <div className={styles.eventTimelineControls}>
                    <button 
                        className={`unstyled-button ${styles.eventTimelineControlButton} ${selectedPeriod === '30days' ? styles.selected : ''}`}
                        onClick={() => setSelectedPeriod('30days')}
                    >30 Days</button>
                    <button 
                        className={`unstyled-button ${styles.eventTimelineControlButton} ${selectedPeriod === '90days' ? styles.selected : ''}`}
                        onClick={() => setSelectedPeriod('90days')}
                    >90 Days</button>
                    <button 
                        className={`unstyled-button ${styles.eventTimelineControlButton} ${selectedPeriod === 'thisyear' ? styles.selected : ''}`}
                        onClick={() => setSelectedPeriod('thisyear')}
                    >This Year</button>
                </div>                
            </header>

            <div className={styles.eventTimelineCardsContainer}>
                {events.map(event => (
                    <EventCard key={event.id} data={event} />
                ))}
            </div>
        </div>
    )
}