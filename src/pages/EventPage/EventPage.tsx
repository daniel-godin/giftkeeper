import { useEffect, useMemo, useState } from 'react';
import styles from './EventPage.module.css'
import { Link, useParams } from 'react-router';
import { collectionGroup, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useEvents } from '../../contexts/EventsContext';
import { Event } from '../../types/EventType';
import { GiftItem } from '../../types/GiftListType';
import { usePeople } from '../../contexts/PeopleContext';
import { Person } from '../../types/PersonType';
import { ArrowLeft, Pencil } from 'lucide-react';
import { getDaysUntilDate } from '../../utils';
import { useGiftLists } from '../../contexts/GiftListsProvider';
import { formatCurrency } from '../../utils/currencyUtils';
import { GiftItemCard } from '../../components/GiftItemCard/GiftItemCard';

export function EventPage() {
    const { eventId } = useParams();
    const { events, loading: eventsLoading } = useEvents();
    const { people, loading: peopleLoading } = usePeople();
    const { loading: giftListsLoading} = useGiftLists();

    const [event, setEvent] = useState<Event>();
    const [associatedPeople, setAssociatedPeople] = useState<Person[]>([]);
    const [giftItemsLoading, setGiftItemsLoading] = useState<boolean>(false);
    const [giftItems, setGiftItems] = useState<GiftItem[]>([]);

    // Fetch Data For UI (event details)
    useEffect(() => {
        // Guard Clause -- Wait For Data Contexts To Load
        if (!eventId || eventsLoading || peopleLoading || giftListsLoading) { return };

        // Find Event In Events Context
        const eventDetails = events.find(event => event.id === eventId);
        if (!eventDetails) { return }; // If no event found, cancel.  TODO:  Possibly set up a redirect or alternate display for user.

        // Get People Associated With Event (event.people array) [array of peopleId's]
        const peopleDetails = people.filter(person => eventDetails.people.includes(person.id || ''))

        setEvent(eventDetails);
        setAssociatedPeople(peopleDetails);

        setGiftItemsLoading(true);

        const q = query(collectionGroup(db, 'giftItems'), where('eventId', '==', eventId))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data() as GiftItem;
                return data;
            });

            setGiftItems(items);
            setGiftItemsLoading(false);
        }, (error) => {
            console.error('Error listening to gift items. Error:', error);
            setGiftItemsLoading(false);
        });

        return () => unsubscribe();
    }, [eventId, events, people])

    // Budget Calculations: Event Budget, Total of Purchased Items, Difference Between Those Two.
    const budgetCalculations = useMemo(() => {
        if (!giftItems || !event || !event.budget) { return }; // Guard Clause

        const totalPurchased = giftItems.reduce((sum, item) => {
            return sum + (item.purchasedCost || 0);
        }, 0)

        return {
            eventBudget: event.budget,
            totalPurchased: totalPurchased,
            budgetLeft: event.budget - totalPurchased
        }
    }, [giftItems, event?.budget])

    return (
        // Can I / Should I do an {event && ()} at the top? or ? : ('Event Not Found')
        <section className={styles.eventPage}>
            <header className={styles.eventPageHeader}>
                <Link to={`/events`} className='unstyled-link'>
                    <ArrowLeft /> Events
                </Link>

                {event && event.title && (
                    <h3>{event.title}</h3>
                )}

                <button 
                    type='button'
                    className={styles.editButton}
                >
                    <Pencil /> Edit
                </button>
            </header>

            <div className={styles.quickStatsContainer}>
                <div className={styles.statCard}>
                    {event && event.date && (
                        <>
                            <header className={styles.statCardHeader}>Date</header>
                            <div className={styles.statNumber}>{event.date}</div>
                            <div className={styles.statLabel}>{getDaysUntilDate(event.date)} days away</div>
                        </>
                    )}
                </div>

                <div className={styles.statCard}>
                    {event && event.people && (
                        <>
                            <header className={styles.statCardHeader}>Participants</header>
                            <div className={styles.statNumber}>{event.people.length}</div>
                            <div className={styles.statLabel}>
                                {associatedPeople.map(person => person.name).join(', ')}
                            </div>
                        </>
                    )}
                </div>

                <div className={styles.statCard}>
                    {event && event.budget && budgetCalculations ? (
                        <>
                            <header className={styles.statCardHeader}>Budget</header>
                            <div className={styles.statNumber}>{formatCurrency(budgetCalculations.totalPurchased)} / {formatCurrency(event.budget)}</div>
                            {/* Third section:  Bar + money left in budget */}
                            <div className={styles.statLabel}>
                                <progress 
                                    className={styles.budgetBar}
                                    value={budgetCalculations.totalPurchased}
                                    max={budgetCalculations.eventBudget}
                                ></progress>
                                <p>{formatCurrency(budgetCalculations.budgetLeft)} remaining</p>
                            </div>
                        </>
                    ) : (
                        <>
                            <p>No Budget Set.</p>
                            <p>Set a Budget</p>
                        </>

                    )}
                </div>
            </div>

            <div className={styles.giftTrackerContainer}>
                {giftItemsLoading ? (
                    <div>Loading Gift Items...</div>
                ) : (
                    <>
                        <header className={styles.giftTrackerHeader}>
                            <h3>Gift Tracker</h3>
                        </header>

                        {/* Needs two versions: Mobile & Desktop. Mobile uses Cards, Desktop uses Table */}
                        <div className={styles.giftItemList}>
                            {/* Map through associated gift items */}
                            {/* Click on card to "edit" something?  Or use an Action button? */}
                            {giftItems.map((item) => (
                                <GiftItemCard
                                    key={item.id}
                                    item={item}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    )
}