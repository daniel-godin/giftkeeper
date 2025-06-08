import { CalendarFold, Gift, ListTodo, UsersRound } from 'lucide-react';
import { useAuth } from '../../../../contexts/AuthContext';
import { useEvents } from '../../../../contexts/EventsContext';
import { useGiftLists } from '../../../../contexts/GiftListsProvider';
import { usePeople } from '../../../../contexts/PeopleContext';
import { useWishLists } from '../../../../contexts/WishListsProvider';
import styles from './Dashboard.module.css'

export function Dashboard () {
    const { authState } = useAuth();
    const { people, loading: peopleLoading } = usePeople();
    const { events, loading: eventsLoading } = useEvents();
    const { giftLists, loading: giftListsLoading } = useGiftLists();
    const { wishLists, loading: wishListsLoading  } = useWishLists();

    return (
        <div className={styles.dashboard}>
            <div className={`${styles.upcomingEvents} ${styles.dashboardBox}`}>
                <header className={styles.headerText}><CalendarFold /> Upcoming Events</header>
                <div className={styles.eventsList}>

                </div>
                <button>View All Events (goes to events)</button>
            </div>

            <div className={`${styles.secondContainer}`}>
                <div className={styles.dashboardBox}>
                    <header className={styles.headerText}><UsersRound /> People</header>
                </div>
                <div className={styles.dashboardBox}>
                    <header className={styles.headerText}><Gift /> Gift Lists</header>
                </div>
                <div className={styles.dashboardBox}>
                    <header className={styles.headerText}><ListTodo /> Wish Lists</header>
                </div>
            </div>
        </div>
    )
}