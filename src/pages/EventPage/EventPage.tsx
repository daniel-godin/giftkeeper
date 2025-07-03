import { useEffect, useState } from 'react';
import styles from './EventPage.module.css'
import { Link, useParams } from 'react-router';
import { collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useEvents } from '../../contexts/EventsContext';
import { Event } from '../../types/EventType';
import { GiftItem } from '../../types/GiftListType';
import { usePeople } from '../../contexts/PeopleContext';
import { Person } from '../../types/PersonType';
import { ArrowLeft, Check, Lightbulb, Pencil } from 'lucide-react';
import { getDaysUntilDate } from '../../utils';
import { useGiftLists } from '../../contexts/GiftListsProvider';
import { capitalizeFirst } from '../../utils/stringUtils';

export function EventPage() {
    const { eventId } = useParams();
    const { events, loading: eventsLoading } = useEvents();
    const { people, loading: peopleLoading } = usePeople();
    const { giftLists, loading: giftListsLoading} = useGiftLists();

    const [event, setEvent] = useState<Event>();
    const [associatedPeople, setAssociatedPeople] = useState<Person[]>([]);
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

        const fetchGiftItems = async () => {
            try {
                const q = query(collectionGroup(db, 'giftItems'), where('eventId', '==', eventId))
                
                // Set up a listener... or just a getDocs???
                const snapshot = await getDocs(q);

                const items = snapshot.docs.map(doc => {
                    const data = doc.data() as GiftItem;
                    return data;
                    // return doc.data() as GiftItem;
                })

                setGiftItems(items);

            } catch (error) {
                console.error('Error fetching gift items. Error:', error);
            }
        }

        fetchGiftItems();

    }, [eventId, events, people, giftLists])

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
                            <div className={styles.statLabel}>Name of people</div>
                        </>
                    )}
                </div>

                <div className={styles.statCard}>
                    {event && event.budget ? (
                        <>
                            <header className={styles.statCardHeader}>Budget</header>
                            <div className={styles.statNumber}>{event.budget}</div>
                            <div className={styles.statLabel}>$$$ Remaining</div>
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
                <header className={styles.giftTrackerHeader}>
                    <h3>Gift Tracker</h3>
                    <button className={styles.addGiftButton}>+ Add Gift</button>
                </header>

                {/* Needs two versions: Mobile & Desktop. Mobile uses Cards, Desktop uses Table */}
                <div className={styles.giftItemList}>
                    {/* Map through associated gift items */}
                    {/* Click on card to "edit" something?  Or use an Action button? */}
                    {giftItems.map((item) => (
                        <div key={item.id} className={styles.giftItemCard}>
                            <div className={styles.giftItemCardRow}>
                                <span className={styles.giftItemCategory}>Person</span>
                                <span className={styles.giftItemDetail}>{item.personName}</span>
                            </div>
                            <div className={styles.giftItemCardRow}>
                                <span className={styles.giftItemCategory}>Gift</span>
                                <span className={styles.giftItemDetail}>{item.name}</span>
                            </div>
                            <div className={styles.giftItemCardRow}>
                                <span className={styles.giftItemCategory}>Status</span>
                                {item.status === 'idea' && (
                                    <span className={styles.giftItemDetailIdea}><Lightbulb size={20}/> {capitalizeFirst(item.status)}</span>
                                )}
                                {item.status === 'purchased' && (
                                    <span className={styles.giftItemDetailPurchased}><Check size={20} /> {capitalizeFirst(item.status)}</span>
                                )}
                            </div>
                            <div className={styles.giftItemCardRow}>
                                <span className={styles.giftItemCategory}>Cost</span>
                                {/* TODO:  Build a helper function to convert cents to dollars.  Both ways (cents > dollars & dollars > cents) */}
                                <span className={styles.giftItemDetail}>{item.purchasedCost}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}