import { Link } from 'react-router';
import { useEvents } from '../../../../contexts/EventsContext';
import { Event } from '../../../../types/EventType';
import styles from './EventsList.module.css';
import { formatDateShort, getDaysUntilDate, getEventUrgency } from '../../../../utils';
import { formatCurrency } from '../../../../utils/currencyUtils';

interface EventsListProps {
    events: Event[];
    giftStatsByEvent: Record<string, { giftCount: number; totalSpent: number }>
}

export function EventsList({ events, giftStatsByEvent } : EventsListProps) {
    const { loading: loadingEvents } = useEvents();

    return (
        <>
            {loadingEvents ? (
                <EventsCardSkeleton />
            ) : (
                <div className={styles.eventsListContainer}>
                    {/* Mapping of "filtered/sorted events" */}
                    {events && events.map(event => (
                        <Link to={`/events/${event.id}`} key={event.id} className={`unstyled-link`}>
                            <div className={styles.eventCard}>
                                <div className={styles.cardRow}>
                                    <div className={styles.titleWithAvatar}>
                                        <div className={styles.avatar}>{event.title.slice(0, 1)}</div>
                                        <span className={styles.eventTitle}>{event.title}</span>
                                    </div>

                                    {event.id && giftStatsByEvent && giftStatsByEvent[event.id] && (
                                            <span className={styles.giftCount}>{giftStatsByEvent[event.id].giftCount} 🎁</span>
                                        )}
                                </div>
                                <div className={styles.cardRow}>
                                    <div className={styles.leftSide}>
                                        {event.type && (<span className={styles.eventTypeTag}>{event.type}</span>)}
                                        {event.type && event.date && ( <span> • </span> )}
                                        {event.date && (
                                            <div className={styles.eventDateInfo}>
                                                <div className={styles.eventDate}>{formatDateShort(event.date)}</div>
                                                {event.date ? (
                                                    <div 
                                                        className={`${styles.eventCountdown} ${styles[getEventUrgency(event.date, '')]}`}
                                                    >
                                                        ({getDaysUntilDate(event.date)} days)
                                                    </div>
                                                ) : (
                                                    <div className={styles.eventCountdown}>--</div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className={styles.rightSide}>
                                        {event.id && giftStatsByEvent && giftStatsByEvent[event.id] && (
                                            <span className={styles.spentAmount}>{formatCurrency(giftStatsByEvent[event.id].totalSpent)}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </>
    )

}

export function EventsCardSkeleton() {

    return (
        <div className={styles.eventsListContainer}>
            <div className={styles.eventCard}>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
            </div>

            <div className={styles.eventCard}>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
            </div>

            <div className={styles.eventCard}>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
                <div className='skeleton-line' style={{ width: '100%' }}></div>
            </div>
        </div>
    )
}