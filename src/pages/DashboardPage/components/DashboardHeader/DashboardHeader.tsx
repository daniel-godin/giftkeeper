import { useEffect, useState } from 'react'
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
import { getCountFromServer, query, where } from 'firebase/firestore';
import { getGiftItemsCollRef } from '../../../../firebase/firestore';
import { useAuth } from '../../../../contexts/AuthContext';

export function DashboardHeader () {
    const { authState } = useAuth();
    const { events } = useEvents();
    const { people } = usePeople();
    const upcomingEvents = useUpcomingEvents();
    const peopleWithBirthdays = usePeopleWithBirthdays();

    // Stats States
    const [giftItemsStats, setGiftItemsStats] = useState({ total: 0, ideas: 0, purchased: 0 });

    // Modal States (boolean) -- Triggered By QuickActionButtons
    const [isAddGiftItemModalOpen, setIsAddGiftItemModalOpen] = useState<boolean>(false);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);

    // TODO: Create a useMemo to save all the stats for the overviewStats section.
    // POSSIBLY:  Move this to parent component, might need these same stats in EventTimeline

    useEffect(() => {
        const getGiftItemsStats = async () => {
            if (!authState.user) { return }; // Guard/Optimization Clause

            const totalQuery = query(getGiftItemsCollRef(authState.user.uid));
            const ideasQuery = query(getGiftItemsCollRef(authState.user.uid), where('status', '==', 'idea'));
            const purchasedQuery = query(getGiftItemsCollRef(authState.user.uid), where('status', '==', 'purchased'));

            const total = await getCountFromServer(totalQuery);
            const ideas = await getCountFromServer(ideasQuery);
            const purchased = await getCountFromServer(purchasedQuery);

            // console.log(total.data().count, ideas, purchased);

            setGiftItemsStats(prev => ({
                ...prev,
                total: total.data().count,
                ideas: ideas.data().count,
                purchased: purchased.data().count
            }))

        }

        getGiftItemsStats()
    }, []);



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
                    totalCount={giftItemsStats.total}
                    breakdownStats={[
                        {count: giftItemsStats.ideas, label: 'ideas'},
                        {count: giftItemsStats.purchased, label: 'bought'}
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