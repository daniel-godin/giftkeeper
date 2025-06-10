import { usePeople } from '../../contexts/PeopleContext';
import styles from './DashboardPage.module.css'
import { Dashboard } from './components/Dashboard/Dashboard';
import { OnboardingForm } from './components/OnboardingForm/OnboardingForm';

export function DashboardPage () {
    const { people, loading: peopleLoading } = usePeople();

    return (
        <section className={styles.dashboardPage}>
            <header className={styles.header}>
                {peopleLoading ? (
                    <h2>Loading...</h2>
                ) : people.length === 0 ? (
                    <h2>Welcome to Gift Keeper!</h2>
                ) : (
                    <h2>Gift Keeper Dashboard</h2>
                )}
            </header>

            <div className={styles.mainContent}>
                {people.length === 0 ? (
                    <OnboardingForm />
                ) : (
                    <Dashboard />
                )}
            </div>
        </section>
    )
}