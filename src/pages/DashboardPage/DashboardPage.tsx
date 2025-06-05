import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { usePeople } from '../../contexts/PeopleContext';
import styles from './DashboardPage.module.css'

export function DashboardPage () {
    const { authState } = useAuth();
    const { people, loading: peopleLoading } = usePeople();


    return (
        <section className={styles.dashboardPage}>
            <header className={styles.header}>
                {!peopleLoading && people.length > 0 && (
                    <h1>Dashboard</h1>
                )}
            </header>

            <div className={styles.mainContent}>
                {peopleLoading ? (
                    <div className={styles.loadingContainer}>
                        Loading...
                    </div>
                ) : people.length === 0 ? (
                    <div className={styles.onboardingForm}>
                        <h1>Welcome to Gift Keeper!</h1>
                        <p>Let's start by adding the people you buy gifts for.</p>
                        <button>Add Your First Person</button>
                    </div>
                ) : (
                    <div className={styles.mainDashboard}>
                        <p>You have {people.length} people in your circle.</p>
                    </div>
                )}
            </div>
        </section>
    )
}