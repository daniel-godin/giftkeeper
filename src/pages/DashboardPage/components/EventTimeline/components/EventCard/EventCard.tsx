import { Event } from '../../../../../../types/EventType';
import styles from './EventCard.module.css'

interface EventCardProps {
    data: Event;
}

export function EventCard({ data }: EventCardProps) {


    return (
        <div className={styles.eventCard}>
            <header className={styles.eventCardHeader}>
                <div className={styles.titleAndDate}>
                    <h4>{data.title}</h4>
                    <p>{data.date}</p>
                </div>
                <div className={styles.countdown}>
                    {/* Pull in helper function for days until */}
                </div>
            </header>

            <div className={styles.eventPeople}>
                <p className={styles.peopleHeader}>PEOPLE</p>
                {data.people.map(person => (
                    <div key={person} className={styles.personButton}>
                        {person}
                    </div>
                ))}
            </div>

            <div className={styles.eventStats}>
                <div className={styles.giftStats}>

                </div>
                <div className={styles.budgetStats}>

                </div>
                <div className={styles.actionButton}>
                    
                </div>
            </div>
        </div>
    )
}