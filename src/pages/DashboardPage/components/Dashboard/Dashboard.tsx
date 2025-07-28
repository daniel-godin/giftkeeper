import { CalendarFold, UsersRound } from 'lucide-react';
import { useEvents } from '../../../../contexts/EventsContext';
import { usePeople } from '../../../../contexts/PeopleContext';
import styles from './Dashboard.module.css'
import { Link } from 'react-router';
import { useUpcomingEvents } from '../../../../hooks/useUpcomingEvents';

export function Dashboard () {
    const { people, loading: peopleLoading } = usePeople();
    const { loading: eventsLoading } = useEvents();

    const upcomingEvents = useUpcomingEvents();

    // Need to make "seconds" Type-safe later.
    // const recent = {
    //     'people': people.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0)).slice(0, 5),
    // }

    return (
        <div className={styles.dashboard}>
            <div className={`${styles.upcomingEvents} ${styles.dashboardBox}`}>
                <header className={styles.headerText}><CalendarFold /> Upcoming Events</header>

                {eventsLoading ? (
                    <p>Loading Events...</p>
                ) : upcomingEvents.length === 0 ? (
                    <p>No Upcoming Dates.  Please Add An Event</p>
                ) : (
                    <>
                        <div className={styles.eventsList}>
                            {upcomingEvents.map((event) => (
                                <p key={event.id} className={styles.item}>{event.title}</p>
                            ))}
                        </div>
                        <Link to='/events' className={styles.link}>View All Events</Link>
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
                                {/* {recent.people.map((person) => (
                                    <p key={person.id} className={styles.item}>{person.name}</p>
                                ))} */}
                            </div>
                            <Link to='/people' className={styles.link}>View All People</Link>
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}