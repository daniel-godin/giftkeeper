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

export function PersonPage() {
    const { authState } = useAuth();
    const { personId } = useParams();
    const { events, loading: eventsLoading } = useEvents();
    const upcomingEvents = useUpcomingEvents(personId);
    const { syncBirthdayEvent } = useBirthdayEventManager();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [person, setPerson] = useState<Person>({ name: '' });
    const [giftIdeasCount, setGiftIdeasCount] = useState(0);

    // State for managing changes to displayed data:
    const [formData, setFormData] = useState<Person>({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Setup a Firestore listener to doc(db, 'users', {userId}, 'people', {personId})
    useEffect(() => {
        // Guard Clauses:
        if (!authState.user || !personId) {
            console.warn('No user or personId found. Cannot fetch data.');
            return;
        }

        setIsLoading(true);

        const personDocRef = getPersonDocRef(authState.user.uid, personId);
        const unsubscribe = onSnapshot(personDocRef, async (snapshot) => {
            // Guard Clause
            if (!snapshot.exists()) {
                console.error('Person Document Not Found');
                setIsLoading(false);
                return;
            }

            if (!authState.user) {
                return;
            }

            const data = snapshot.data() as Person;

            // Fetch Gift Ideas Count (Possibly switch this to use a data useContext)
            if (data.giftListId) {
                const count = await fetchGiftIdeasCount(authState.user.uid, data.giftListId)
                setGiftIdeasCount(count);
            }
            
            setPerson(data);
            setFormData(data);
            setIsLoading(false);
        }, (error) => {
            console.error('Error setting up snapshot for person. Error:', error);
            setIsLoading(false);
        })
        
        return () => unsubscribe();
    }, []);

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