import { useState } from 'react';
import { QuickActionButton } from '../../../../components/ui/QuickActionButton/QuickActionButton'
import styles from './PeopleHeader.module.css'
import { UsersRound } from 'lucide-react';
import { StatCard } from '../../../../components/ui/StatCard/StatCard';
import { usePeople } from '../../../../contexts/PeopleContext';
import { useEvents } from '../../../../contexts/EventsContext';

export function PeopleHeader() {
    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);

    const { people, loading: loadingPeople } = usePeople();
    const { events, loading: eventsLoading } = useEvents();
    

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

            {/* TODO:  FIX TYPE OF STATS */}
            <div className={styles.statsOverview}>
                <StatCard
                    to='/people'
                    title='PEOPLE'
                    totalCount={people.length}
                    breakdownStats={[
                        // TODO: FIX THIS
                        {count: people.length, label: 'total'}
                    ]}
                />

                <StatCard
                    to='/people'
                    title='EVENTS'
                    totalCount={events.length}
                    breakdownStats={[
                        // TODO: FIX THIS
                        {count: events.length, label: 'total'}
                    ]}
                />
            </div>
        </header>
    )
}