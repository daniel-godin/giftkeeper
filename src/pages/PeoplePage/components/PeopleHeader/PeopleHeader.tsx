import { useState } from 'react';
import { QuickActionButton } from '../../../../components/ui/QuickActionButton/QuickActionButton'
import styles from './PeopleHeader.module.css'
import { UsersRound } from 'lucide-react';
import { StatCard } from '../../../../components/ui/StatCard/StatCard';
import { AddPersonModal } from '../../../../components/modals/AddPersonModal/AddPersonModal';
import { useGiftStats } from '../../../../hooks/useGiftStats';
import { useUpcomingEvents } from '../../../../hooks/useUpcomingEvents';

export function PeopleHeader() {
    const giftStats = useGiftStats();
    const upcomingEventsTotal = useUpcomingEvents();
    const upcomingEvents = useUpcomingEvents(undefined, '30days');

    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);

    return (
        <header className={styles.peopleHeader}>
            <div className={styles.titleAndQuickActionButtonsContainer}>
                <h2 className={styles.pageTitle}>People</h2>

                <QuickActionButton
                    icon={<UsersRound />}
                    text='Add Person'
                    onClick={() => setIsAddPersonModalOpen(true)}
                    variant='primary'
                />
            </div>

            {/* Various Stats - total upcoming events + events within 30 days */}
            {/* Gift Stats */}
            <div className={styles.statsOverview}>
                <StatCard
                    to='/events'
                    title='UPCOMING EVENTS'
                    totalCount={upcomingEventsTotal.length}
                    breakdownStats={[
                        {count: upcomingEvents.length, label: 'within 30 days'}
                    ]}
                />

                <StatCard
                    to='/giftItems'
                    title='GIFTS'
                    totalCount={giftStats.total}
                    breakdownStats={[
                        {count: giftStats.ideas, label: 'ideas'},
                        {count: giftStats.purchased, label: 'bought'}
                    ]}
                />
            </div>

            <AddPersonModal
                isOpen={isAddPersonModalOpen}
                onClose={() => setIsAddPersonModalOpen(false)}
            />
        </header>
    )
}