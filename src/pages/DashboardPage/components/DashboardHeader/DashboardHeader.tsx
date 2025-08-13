import { useState } from 'react'
import styles from './DashboardHeader.module.css'
import { QuickActionButton } from '../../../../components/ui/QuickActionButton/QuickActionButton'
import { CalendarFold, Gift, UsersRound } from 'lucide-react'
import { AddGiftItemModal } from '../../../../components/modals/AddGiftItemModal/AddGiftItemModal';
import { AddEventModal } from '../../../../components/modals/AddEventModal/AddEventModal';
import { AddPersonModal } from '../../../../components/modals/AddPersonModal/AddPersonModal';
import { StatCard } from './components/StatCard/StatCard';
import { useEvents } from '../../../../contexts/EventsContext';
import { usePeople } from '../../../../contexts/PeopleContext';
import { useUpcomingEvents } from '../../../../hooks/useUpcomingEvents';
import { usePeopleWithBirthdays } from '../../../../hooks/usePeopleWithBirthdays';
import { useGiftStats } from '../../../../hooks/useGiftStats';

export function DashboardHeader () {
    const { events } = useEvents();
    const { people } = usePeople();
    const upcomingEvents = useUpcomingEvents();
    const peopleWithBirthdays = usePeopleWithBirthdays();
    const giftStats = useGiftStats();

    // Modal States (boolean) -- Triggered By QuickActionButtons
    const [isAddGiftItemModalOpen, setIsAddGiftItemModalOpen] = useState<boolean>(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);

    return (
        <header className={styles.dashboardHeader}>
            <div className={styles.titleAndQuickActionButtonsContainer}>
                <h2 className={styles.pageTitle}>Dashboard</h2>
                
                <div className={styles.quickActionButtonsContainer}>
                    <QuickActionButton
                        icon={<Gift />}
                        text='Add Gift'
                        onClick={() => setIsAddGiftItemModalOpen(true)}
                        variant='primary'
                    />

                    <QuickActionButton
                        icon={<CalendarFold />}
                        text='Create Event'
                        onClick={() => setIsAddEventModalOpen(true)}
                        variant='secondary'
                    />

                    <QuickActionButton
                        icon={<UsersRound />}
                        text='Add Person'
                        onClick={() => setIsAddPersonModalOpen(true)}
                        variant='secondary'
                    />
                </div>
            </div>


            <div className={styles.statsOverview}>
                <StatCard
                    to='/events'
                    title='EVENTS'
                    totalCount={events.length}
                    breakdownStats={[
                        {count: upcomingEvents.length, label: 'upcoming'}
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

                <StatCard
                    to='/people'
                    title='PEOPLE'
                    totalCount={people.length}
                    breakdownStats={[{count: peopleWithBirthdays.length, label: 'birthdays'}]}
                />
            </div>

            {/* Modals */}
            <AddGiftItemModal isOpen={isAddGiftItemModalOpen} onClose={() => setIsAddGiftItemModalOpen(false)} />
            <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setIsAddEventModalOpen(false)} />
            <AddPersonModal isOpen={isAddPersonModalOpen} onClose={() => setIsAddPersonModalOpen(false)} />
        </header>
    )
}