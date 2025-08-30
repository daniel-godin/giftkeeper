import { useState } from 'react';
import { QuickActionButton } from '../../../../components/ui/QuickActionButton/QuickActionButton'
import styles from './EventsHeader.module.css';
import { CalendarFold } from 'lucide-react';
import { StatCard } from '../../../../components/ui/StatCard/StatCard';
import { useUpcomingEvents } from '../../../../hooks/useUpcomingEvents';
import { AddEventModal } from '../../../../components/modals/AddEventModal/AddEventModal';

export function EventsHeader() {
    const upcomingEventsTotal = useUpcomingEvents();
    const upcomingEvents = useUpcomingEvents(undefined, '30days');

    const [isAddNewEventModalOpen, setIsAddNewEventModalOpen] = useState<boolean>(false);

    return (
        <header className={styles.eventsHeader}>
            <div className={styles.titleAndQuickActionButtonsContainer}>
                <h2 className={styles.pageTitle}>Events</h2>

                <QuickActionButton
                    icon={<CalendarFold />}
                    text='Create Event'
                    onClick={() => setIsAddNewEventModalOpen(true)}
                    variant='primary'
                />
            </div>

            {/* Various Important Stats -- TODO:  UPDATE THIS */}
            <div className={styles.statsOverview}>
                <StatCard
                    to='/events'
                    title='UPCOMING EVENTS'
                    totalCount={upcomingEventsTotal.length}
                    breakdownStats={[
                        {count: upcomingEvents.length, label: 'within 30 days'}
                    ]}
                />
            </div>

            <AddEventModal
                isOpen={isAddNewEventModalOpen}
                onClose={() => setIsAddNewEventModalOpen(false)}
            />
        </header>
    )
}