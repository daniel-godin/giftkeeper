import { useState } from 'react'
import styles from './DashboardHeader.module.css'
import { QuickActionButton } from './components/QuickActionButton/QuickActionButton'
import { CalendarFold, Gift, UsersRound } from 'lucide-react'
import { AddGiftItemModal } from '../../../../components/modals/AddGiftItemModal/AddGiftItemModal';
import { AddEventModal } from '../../../../components/modals/AddEventModal/AddEventModal';
import { AddPersonModal } from '../../../../components/modals/AddPersonModal/AddPersonModal';

export function DashboardHeader () {

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


            <div className={styles.overviewStatsContainer}>
                <button className={styles.statButton}>Events</button>
                <button className={styles.statButton}>Gifts</button>
                <button className={styles.statButton}>People</button>
            </div>

            {/* Alerts:  Add an X to "close" this warning message box*/}
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