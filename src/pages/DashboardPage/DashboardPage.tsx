import styles from './DashboardPage.module.css'
import { Dashboard } from './components/Dashboard/Dashboard';

export function DashboardPage () {

    return (
        <section className={styles.dashboardPage}>
            <header className={styles.header}>
                <h2>Gift Keeper Dashboard</h2>
            </header>

            <div className={styles.mainContent}>
                <Dashboard />
            </div>
        </section>
    )
}