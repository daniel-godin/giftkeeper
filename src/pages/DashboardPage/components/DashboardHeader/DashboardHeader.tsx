import { useState } from 'react'
import styles from './DashboardHeader.module.css'
import { QuickActionButton } from './components/QuickActionButton/QuickActionButton'
import { CalendarFold, Gift, UsersRound } from 'lucide-react'
import { AddGiftItemModal } from '../../../../components/modals/AddGiftItemModal/AddGiftItemModal';
import { AddEventModal } from '../../../../components/modals/AddEventModal/AddEventModal';
import { AddPersonModal } from '../../../../components/modals/AddPersonModal/AddPersonModal';
import { StatCard } from './components/StatCard/StatCard';
import { useEvents } from '../../../../contexts/EventsContext';
import { usePeople } from '../../../../contexts/PeopleContext';
import { useUpcomingEvents } from '../../../../hooks/useUpcomingEvents';
import { usePeopleWithBirthdays } from '../../../../hooks/usePeopleWithBirthdays';

export function DashboardHeader () {
    const { events } = useEvents();
    const { people } = usePeople();
    const upcomingEvents = useUpcomingEvents();
    const peopleWithBirthdays = usePeopleWithBirthdays();

    // Modal States (boolean) -- Triggered By QuickActionButtons
    const [isAddGiftItemModalOpen, setIsAddGiftItemModalOpen] = useState<boolean>(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);

    // TODO: Create a useMemo to save all the stats for the overviewStats section.
    // POSSIBLY:  Move this to parent component, might need these same stats in EventTimeline



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
                    totalCount={30}
                    breakdownStats={[
                        {count: 23, label: 'ideas'},
                        {count: 7, label: 'bought'}
                    ]}
                />

                <StatCard
                    to='/people'
                    title='PEOPLE'
                    totalCount={people.length}
                    breakdownStats={[{count: peopleWithBirthdays.length, label: 'birthdays'}]}
                />
            </div>

            {/* Alerts:  Add an X to "close" this warning message box*/}
            {/* TODO:  CREATE THE SMART ALERTS SECTION -- WILL NEED MORE LOGIC */}
            {/* <div className={styles.alertsContainer}>
                Christmas is in 5 days and you need to purchase gifts for 4 people. Time to act!
            </div> */}

            {/* Modals */}
            <AddGiftItemModal isOpen={isAddGiftItemModalOpen} onClose={() => setIsAddGiftItemModalOpen(false)} />
            <AddEventModal isOpen={isAddEventModalOpen} onClose={() => setIsAddEventModalOpen(false)} />
            <AddPersonModal isOpen={isAddPersonModalOpen} onClose={() => setIsAddPersonModalOpen(false)} />
        </header>
    )
}