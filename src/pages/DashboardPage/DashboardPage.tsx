import styles from './DashboardPage.module.css'
import { Dashboard } from './components/Dashboard/Dashboard';

export function DashboardPage () {

    return (
        <section className={styles.dashboardPage}>
            <DashboardHeader />

            <EventTimeline />

            {/* <div className={styles.mainContent}>
                <Dashboard />
            </div>  */}
        </section>
    )
}

function DashboardHeader () {

    return (
        <header className={styles.dashboardHeader}>
            <h2 className={styles.pageTitle}>Dashboard</h2>
                
            <div className={styles.createButtonsContainer}>
                <button className={styles.createButton}>Add Gift</button>
                <button className={styles.createButton}>Create Event</button>
                <button className={styles.createButton}>Add Person</button>
            </div>

            <div className={styles.alertsContainer}>
                Christmas is in 5 days and you need to purchase gifts for 4 people. Time to act!
            </div>

            <div className={styles.overviewStatsContainer}>
                <button className={styles.statButton}>Events</button>
                <button className={styles.statButton}>Gifts</button>
                <button className={styles.statButton}>People</button>
            </div>
        </header>
    )
}

function EventTimeline () {

    return (
        <div className={styles.eventTimelineContainer}>
            <header className={styles.eventTimelineHeader}>
                <h3>Event Timeline</h3>
                <button className={styles.eventTimelineControlButton}>30 Days</button>
                <button className={styles.eventTimelineControlButton}>90 Days</button>
                <button className={styles.eventTimelineControlButton}>This Year</button>
            </header>

            <div className={styles.eventTimelineCardsContainer}>
                {/* events.map... use re-usable component. */}
            </div>
        </div>
    )
}