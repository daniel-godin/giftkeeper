import { Link } from 'react-router';
import { Event } from '../../../../../../types/EventType';
import { getDaysUntilDate } from '../../../../../../utils';
import styles from './EventCard.module.css'
import { getPersonNameFromId } from '../../../../../../utils/peopleUtils';
import { useMemo } from 'react';
import { useGiftItems } from '../../../../../../contexts/GiftItemsContext';
import { formatCurrency } from '../../../../../../utils/currencyUtils';

interface EventCardProps {
    data: Event;
}

export function EventCard({ data }: EventCardProps) {
    const { giftItems } = useGiftItems();
    
    // Dynamic coloring depending on how soon the event is.
    const urgencyLevel = useMemo(() => {
        const daysUntil = getDaysUntilDate(data.date);

        if (daysUntil <= 7) { return 'urgent' };
        if (daysUntil <= 21) { return 'warning' };
        return 'good'
    }, [data.date]);

    const eventStats = useMemo(() => {
        const giftsForThisEvent = giftItems.filter(item => item.eventId === data.id);
        const purchasedAmount = giftsForThisEvent.reduce((total, item) => {
            return total + (item.purchasedCost || 0);
        }, 0)

        const peopleWithPurchasedGifts = new Set(
            giftsForThisEvent.map(item => item.personId)
        )

        const returnObject = {
            giftsForThisEvent,
            numberOfPeople: data.people.length,
            peopleWithGifts: peopleWithPurchasedGifts.size,
            numberOfGifts: giftsForThisEvent.length,
            budget: data.budget || 0,
            purchasedAmount: purchasedAmount
        }

        return returnObject;
    }, [data, giftItems]);

    return (
        <div className={`${styles.eventCard} ${styles[urgencyLevel]}`}>
            <header className={styles.eventCardHeader}>
                <div className={styles.titleAndDate}>
                    <h4 className={styles.eventTitle}>{data.title}</h4>
                    <p className={styles.eventDate}>{data.date}</p>
                </div>
                <div className={`${styles.countdownBadge} ${styles[urgencyLevel]}`}>
                    <span>{getDaysUntilDate(data.date)} days</span>
                </div>
            </header>

            <div className={styles.eventPeople}>
                <p className={styles.peopleHeader}>PEOPLE</p>
                <div className={styles.peopleList}>
                    {data.people.map(personId => (
                        <div key={personId} className={styles.personTag}>
                            {getPersonNameFromId(personId)}
                        </div>
                    ))}
                </div>
            </div>

            <div className={styles.eventStats}>
                <div className={styles.progressContainer}>
                    <header className={styles.progressHeader}>
                        <p>People With Gifts Purchased:</p>
                        <p>{eventStats.peopleWithGifts}/{eventStats.numberOfPeople}</p>
                    </header>

                    {/* Custom Progress Bar:  PeopleWithGifts / NumberOfPeople */}
                    <div className={`${styles.customProgressBar} ${styles[urgencyLevel]}`}>
                        <div 
                            className={styles.progressFill}
                            style={{ width: `${eventStats.numberOfPeople > 0 ? (eventStats.peopleWithGifts / eventStats.numberOfPeople) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.progressContainer}>
                    <header className={styles.progressHeader}>
                        <p>Event Budget</p>

                        {data.budget && data.budget > 0 ? (
                            <p>{formatCurrency(eventStats.purchasedAmount)} / {formatCurrency(eventStats.budget)}</p>
                        ): (
                            <p>No budget set</p>
                        )}
                    </header>

                    {/* Custom Progress Bar:  TotalPurchasedAmountOfGiftItems / EventBudget */}
                    <div className={`${styles.customProgressBar} ${styles[urgencyLevel]}`}>
                        <div 
                            className={styles.progressFill}
                            style={{ width: `${eventStats.budget > 0 ? (eventStats.purchasedAmount / eventStats.budget) * 100 : 0}%` }}
                        />
                    </div>
                </div>

                <Link className={`unstyled-link ${styles.actionButton} ${styles[urgencyLevel]}`} to={`/events/${data.id}`}>
                    Go To Event
                </Link>
            </div>
        </div>
    )
}