import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import { useEvents } from '../../contexts/EventsContext';
import { useGiftLists } from '../../contexts/GiftListsProvider';
import { usePeople } from '../../contexts/PeopleContext';
import { useWishLists } from '../../contexts/WishListsProvider';
import styles from './DashboardPage.module.css'
import { Dashboard } from './components/Dashboard/Dashboard';
import { OnboardingForm } from './components/OnboardingForm/OnboardingForm';

export function DashboardPage () {
    const { authState } = useAuth();


    // FOR TESTING PURPOSES:
    const { people, loading: peopleLoading } = usePeople();
    const { events } = useEvents();
    const { giftLists } = useGiftLists();
    const { wishLists } = useWishLists();

    useEffect(() => {
        console.log('people:', people);
        console.log('events:', events);
        console.log('giftLists:', giftLists);
        console.log('wishLists:', wishLists);

    }, [people, events, giftLists, wishLists])

    

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