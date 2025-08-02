import styles from './DashboardPage.module.css'
// import { Dashboard } from './components/Dashboard/Dashboard';
import { DashboardHeader } from './components/DashboardHeader/DashboardHeader';
import { EventTimeline } from './components/EventTimeline/EventTimeline';

export function DashboardPage () {

    return (
        <section className={styles.dashboardPage}>
            <DashboardHeader />

            <EventTimeline />
        </section>
    )
}