import styles from './AppMockup.module.css';

export function AppMockup() {

    return (
        <div className={styles.appMockup}>
            <div className={styles.appScreen}>
                <div className={styles.appHeader}>
                    <div className={styles.logo}>GiftKeeper</div>
                    <div className={styles.appNav}>
                        <div className={styles.navItem}>👥 People</div>
                        <div className={styles.navItem}>📅 Events</div>
                        <div className={styles.navItem}>🎁 Gifts</div>
                    </div>
                </div>
                <div className={styles.appContent}>
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>Quick Stats</div>
                        </div>
                        <div className={styles.statGrid}>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>12</div>
                                <div className={styles.statLabel}>People</div>
                            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>8</div>
                                <div className={styles.statLabel}>Events</div>
            </div>
                            <div className={styles.statItem}>
                                <div className={styles.statNumber}>24</div>
                                <div className={styles.statLabel}>Gift Ideas</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className={styles.dashboardCard}>
                        <div className={styles.cardHeader}>
                            <div className={styles.cardTitle}>Upcoming Events</div>
                        </div>
                        <div className={styles.eventItem}>
                            <div>
                                <strong>Mom's Birthday</strong><br />
                                <small>March 15, 2024</small>
                            </div>
                            <div>12 days</div>
                        </div>
                        <div className={styles.eventItem}>
                            <div>
                                <strong>Anniversary</strong><br />
                                <small>March 22, 2024</small>
                            </div>
                            <div>19 days</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}