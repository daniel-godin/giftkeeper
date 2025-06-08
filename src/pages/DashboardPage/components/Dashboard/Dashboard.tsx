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

                {eventsLoading ? (
                    <p>Loading Events...</p>
                ) : (
                    <>
                        <div className={styles.eventsList}>
                            {events.map((event) => (
                                <p key={event.id} className={styles.item}>{event.title}</p>
                            ))}
                        </div>
                        <button type='button' className={styles.linkButton}>View All Events</button>
                    </>
                )}
            </div>

            <div className={`${styles.secondContainer}`}>
                <div className={styles.dashboardBox}>
                    <header className={styles.headerText}><UsersRound /> People</header>

                    {peopleLoading ? (
                        <p>Loading People...</p>
                    ) : (
                        <>
                            <p className={styles.numberOfItems}>({people.length} people)</p>
                            <div className={styles.recentFiveContainer}>
                                {people.map((person) => (
                                    <p key={person.id} className={styles.item}>{person.name}</p>
                                ))}
                            </div>
                            <button type='button' className={styles.linkButton}>View All People</button>
                        </>
                    )}
                </div>

                <div className={styles.dashboardBox}>
                    <header className={styles.headerText}><Gift /> Gift Lists</header>

                    {giftListsLoading ? (
                        <p>Loading Gift Lists...</p>
                    ) : (
                        <>
                            <p className={styles.numberOfItems}>({giftLists.length} lists)</p>
                            <div className={styles.recentFiveContainer}>
                                {giftLists.map((giftList) => (
                                    <p key={giftList.id} className={styles.item}>{giftList.title}</p>
                                ))}
                            </div>
                            <button type='button' className={styles.linkButton}>View All Gift Lists</button>
                        </>
                    )}
                </div>

                <div className={styles.dashboardBox}>
                    <header className={styles.headerText}><ListTodo /> Wish Lists</header>

                    {wishListsLoading ? (
                        <p>Loading Wish Lists...</p>
                    ) : (
                        <>
                            <p className={styles.numberOfItems}>({wishLists.length} lists)</p>
                            <div className={styles.recentFiveContainer}>
                                {wishLists.map((wishList) => (
                                    <p key={wishList.id} className={styles.item}>{wishList.title}</p>
                                ))}
                            </div>
                            <button type='button' className={styles.linkButton}>View All Wish Lists</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}