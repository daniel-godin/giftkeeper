import styles from './DashboardPage.module.css'
import { Dashboard } from './components/Dashboard/Dashboard';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';

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