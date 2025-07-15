import { Link, useParams } from 'react-router'
import styles from './PersonPage.module.css'
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getGiftItemsCollRef, getPersonDocRef } from '../../firebase/firestore';
import { getCountFromServer, onSnapshot, query, serverTimestamp, where, writeBatch } from 'firebase/firestore';
import { Person } from '../../types/PersonType';
import { formatFirestoreDate, getDaysUntilDate } from '../../utils';
import { db } from '../../firebase/firebase';
import { useUpcomingEvents } from '../../hooks/useUpcomingEvents';
import { useEvents } from '../../contexts/EventsContext';
import { useBirthdayEventManager } from '../../hooks/useBirthdayEventManager';
import { usePeople } from '../../contexts/PeopleContext';
import { GiftItemsTable } from '../../components/GiftItemsTable/GiftItemsTable';
import { GiftItem } from '../../types/GiftListType';
import { useViewport } from '../../contexts/ViewportContext';
import { GiftItemCard } from '../../components/GiftItemCard/GiftItemCard';

export function PersonPage() {
    const { authState } = useAuth();
    const { personId } = useParams();
    const deviceType = useViewport();
    const { people, loading: peopleLoading } = usePeople();
    const { events, loading: eventsLoading } = useEvents();
    const upcomingEvents = useUpcomingEvents(personId);
    const { syncBirthdayEvent } = useBirthdayEventManager();

    const [person, setPerson] = useState<Person>({ name: '' });
    const [giftIdeasCount, setGiftIdeasCount] = useState(0);
    const [giftItems, setGiftItems] = useState<GiftItem[]>([]);

    // State for managing changes to displayed data:
    const [formData, setFormData] = useState<Person>({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Grab data for personId from people data context array.  Don't duplicate Firestore listener.
    useEffect(() => {
        if (!personId || !people) { return }; // Guard Clause

        const fetchPersonData = async () => {
            const personData = people.find(person => person.id === personId);
            if (!personData) { return }; // Guard Clause -- If no person found exit out.
            // TODO:  Display some kind of message to user in UI that no person found with that ID.
            setPerson(personData);
            setFormData(personData);

            // Fetch Number of "ideas" (note: NOT purchased items) for this person:
            if (!authState.user || !authState.user.uid || !personData.giftListId) { return } // Guard Clause
            try {
                const count = await fetchGiftIdeasCount(authState.user.uid, personData.giftListId);
                setGiftIdeasCount(count);
            } catch (error) {
                console.error('Error fetching number of gift ideas for person. Error:', error);
            }
        }
        fetchPersonData();
    }, [personId, people, authState.user?.uid]);

    // Firestore Lister For Person Gift Items
    useEffect(() => {
        if (!authState.user || !person.giftListId) { return }; // Guard

        const collRef = getGiftItemsCollRef(authState.user?.uid, person.giftListId);

        const unsubscribe = onSnapshot(collRef, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data() as GiftItem;
                return data
            });

            setGiftItems(items);
        }, (error) => {
            console.error('Error listening to gift items. Error:', error);

        });

        return () => unsubscribe();
    }, [authState.user, person])

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
    
        if (!authState.user || !personId) return;

        // If birthdayChanged or nameChanged... means the birthday Event should be created or updated.
        const birthdayChanged = person.birthday !== formData.birthday;
        const nameChanged = person.name !== formData.name;

        setIsSubmitting(true);
        try {
            // Need writeBatch to sync person document & birthday event document.
            const batch = writeBatch(db);
            const personDocRef = getPersonDocRef(authState.user.uid, personId);

            if ((birthdayChanged || nameChanged) && formData.birthday && formData.name) {
                await syncBirthdayEvent(personId, formData.name, formData.birthday, batch)
            };
            
            // Always update person
            batch.update(personDocRef, {
                ...formData,
                updatedAt: serverTimestamp()
            })

            await batch.commit()
        } catch (error) {
            console.error('Error updating person:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (peopleLoading) {
        return <div>Loading Person...</div>
    }

    return (
        <section className={styles.personPage}>
            <form className={styles.personForm} onSubmit={handleSubmit} autoComplete='off'>
                <div className={styles.navHeader}>
                    <Link to={`/people`} className={styles.backButton}>
                        ← People
                    </Link>
                    {person.createdAt && (
                        <p>Created On: {formatFirestoreDate(person.createdAt, 'long')}</p>
                    )}
                </div>

                {person.name ? ( 
                    // Probably put "Editable Title" here later.
                    <h2>{person.name}</h2> 
                ) : ( 
                    <h3>Unknown Name</h3> 
                )}

                <label className={styles.label}>Relationship
                    <input
                        className={styles.input}
                        type='text'
                        name='relationship'
                        required={false}
                        value={formData.relationship || ''}
                        disabled={isSubmitting}
                        onChange={handleTextInputChange}
                    />
                </label>
                    
                <label className={styles.label}>Birthday
                    <input
                        className={styles.input}
                        type='date'
                        name='birthday'
                        required={false}
                        value={formData.birthday || ''}
                        disabled={isSubmitting}
                        onChange={handleDateInputChange}
                    />
                </label>

                <button type='submit' className={styles.button}>Edit Person</button>
            </form>

            <div className={styles.personDataContainer}>
                <div className={styles.quickStats}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{upcomingEvents.length}</div>
                        <div className={styles.statLabel}>Events Coming Up</div>
                    </div>
                    <div className={styles.statCard}>
                        {person.birthday ? (
                            <>
                                <div className={styles.statNumber}>{getDaysUntilDate(person.birthday)}</div>
                                <div className={styles.statLabel}>Days to Birthday</div>
                            </>
                        ) : (
                            <div className={styles.statLabel}>No Birthday Set</div>
                        )}
                    </div>

                    <Link to={`/gift-lists/${person.giftListId}`} className='unstyled-link'>
                        <div className={styles.statCard}>
                            <div className={styles.statNumber}>{giftIdeasCount}</div>
                            <div className={styles.statLabel}>Gift Ideas</div>
                        </div>
                    </Link>
                </div>

                <div className={styles.sectionContainer}>
                    <header className={styles.sectionHeader}>
                        Upcoming Dates
                    </header>
                    <div className={styles.sectionData}>
                        {eventsLoading ? (
                            <p>Loading events...</p>
                        ) : upcomingEvents.length === 0 ? (
                            <p>No upcoming dates.  Please add an important date.</p>
                        ) : (
                            upcomingEvents.map((event) => (
                                <div key={event.id} className={styles.eventContainer}>
                                    <span><strong>{event.title}</strong> - {event.date}</span>
                                    <span>{getDaysUntilDate(event.date)} days</span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                <div className={styles.sectionContainer}>
                    <header className={styles.sectionHeader}>
                        Gift Intelligence
                    </header>
                </div>
            </div>

            <div className={styles.giftItems}>
                <header className={styles.sectionHeader}>Gift Items</header>

                {deviceType === 'mobile' && (
                    <>
                        {giftItems.map((item) => (
                            <GiftItemCard
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </>
                )}
                {deviceType === 'desktop' && ( <GiftItemsTable data={giftItems} /> )}         
            </div>
        </section>
    )
}

export async function fetchGiftIdeasCount (userId: string, giftListId: string) {
    // Guard Clauses
    if (!userId) {
        console.error('Need authState.user to get item count');
        return 0;
    }

    if (!giftListId) {
        console.error('need giftlistId')
        return 0;
    }

    try {
        const collRef = getGiftItemsCollRef(userId, giftListId)
        const q = query(collRef, where('status', '==', 'idea'))

        const snapshot = await getCountFromServer(q);
        const count = snapshot.data().count;

        return count;
    } catch (error) {
        console.error('Error getting gift list ideas count. Error', error);
        return 0;
    }
}