import { useAuth } from '../../../../contexts/AuthContext';
import styles from './Dashboard.module.css'

export function Dashboard () {
    const { authState } = useAuth();
    // Other Contexts Here.

    return (
        <div className={styles.dashboard}>
            <div className={`${styles.upcomingEvents} ${styles.dashboardBox}`}>
                <header>Upcoming Events</header>
                <div className={styles.eventsList}>

                </div>
                <button>View All Events (goes to events)</button>
            </div>

            <div className={`${styles.secondContainer} ${styles.dashboardBox}`}>
                <div className={styles.dashboardBox}>
                    <header>People</header>
                </div>
                <div className={styles.dashboardBox}>
                    <header>Gift Lists</header>
                </div>
                <div className={styles.dashboardBox}>
                    <header>Wish Lists</header>
                </div>
            </div>
        </div>
    )
}