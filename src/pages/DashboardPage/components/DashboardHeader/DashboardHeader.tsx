import styles from './DashboardHeader.module.css'

export function DashboardHeader () {

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