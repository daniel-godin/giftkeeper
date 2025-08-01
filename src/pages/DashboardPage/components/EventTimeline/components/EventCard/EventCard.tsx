import { Link } from 'react-router';
import { Event } from '../../../../../../types/EventType';
import { getDaysUntilDate } from '../../../../../../utils';
import styles from './EventCard.module.css'
import { usePeople } from '../../../../../../contexts/PeopleContext';

interface EventCardProps {
    data: Event;
}

export function EventCard({ data }: EventCardProps) {
    const { people } = usePeople();

    const getPersonName = (personId: string) => {
        const person = people.find(p => p.id === personId);
        return person?.nickname || person?.name || 'Unknown';
    }

    return (
        <div className={styles.eventCard}>
            <header className={styles.eventCardHeader}>
                <div className={styles.titleAndDate}>
                    <h4 className={styles.eventTitle}>{data.title}</h4>
                    <p className={styles.eventDate}>{data.date}</p>
                </div>
                <div className={styles.countdownBadge}>
                    <span>{getDaysUntilDate(data.date)} days</span>
                </div>
            </header>

            <div className={styles.eventPeople}>
                <p className={styles.peopleHeader}>PEOPLE</p>
                <div className={styles.peopleList}>
                    {data.people.map(personId => (
                        <div key={personId} className={styles.personTag}>
                            {getPersonName(personId)}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.eventStats}>
                <div className={styles.progressContainer}>
                    <header className={styles.progressHeader}>
                        <p>Gifts Purchased</p>
                        <p>0/4 people</p>
                    </header>

                    <progress
                        className={styles.progressBar}
                        value={0}
                        max={data.budget}
                    />
                </div>

                <div className={styles.divider}></div>

                <div className={styles.progressContainer}>
                    <header className={styles.progressHeader}>
                        <p>Event Budget</p>
                        <p>$0 / $400</p>
                    </header>

                    <progress
                        className={styles.progressBar}
                        value={0}
                        max={data.budget}
                    />
                </div>
                <Link className={`unstyled-link ${styles.actionButton}`} to={`/events/${data.id}`}>
                    Go To Event
                </Link>
            </div>
        </div>
    )
}