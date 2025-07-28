import { Link, useNavigate, useParams } from 'react-router'
import styles from './PersonPage.module.css'
import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getGiftItemsCollRef, getPersonDocRef } from '../../firebase/firestore';
import { deleteDoc, onSnapshot, query, where } from 'firebase/firestore';
import { Person } from '../../types/PersonType';
import { getDaysUntilDate } from '../../utils';
import { useUpcomingEvents } from '../../hooks/useUpcomingEvents';
import { useEvents } from '../../contexts/EventsContext';
import { usePeople } from '../../contexts/PeopleContext';
import { GiftItemsTable } from '../../components/GiftItemsTable/GiftItemsTable';
import { GiftItem } from '../../types/GiftType';
import { useViewport } from '../../contexts/ViewportContext';
import { GiftItemCard } from '../../components/GiftItemCard/GiftItemCard';
import { QuickAddButton } from '../../components/ui/QuickAddButton/QuickAddButton';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { DEFAULT_PERSON } from '../../constants/defaultObjects';
import { EditPersonModal } from '../../components/modals/EditPersonModal/EditPersonModal';

export function PersonPage() {
    const { authState } = useAuth();
    const { personId } = useParams();
    const deviceType = useViewport();
    const { people, loading: peopleLoading } = usePeople();
    const { loading: eventsLoading } = useEvents();
    const upcomingEvents = useUpcomingEvents(personId);

    const navigate = useNavigate();

    const [person, setPerson] = useState<Person>({ name: '' });
    const [giftItems, setGiftItems] = useState<GiftItem[]>([]);

    // State For EditPersonModal:
    const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState<boolean>(false);
    const [editPersonModalData, setEditPersonModalData] = useState<Person>(DEFAULT_PERSON);

    const giftIdeasCount = useMemo(() => {
        return giftItems.filter(item => item.status === 'idea').length;
    }, [giftItems])

    // Grab data for personId from people data context array.  Don't duplicate Firestore listener.
    useEffect(() => {
        if (!personId || !people) { return }; // Guard Clause

        const fetchPersonData = async () => {
            const personData = people.find(person => person.id === personId);
            if (!personData) { return }; // Guard Clause -- If no person found exit out.
            // TODO:  Display some kind of message to user in UI that no person found with that ID.
            setPerson(personData);
        }

        fetchPersonData();
    }, [personId, people, authState.user?.uid]);

    // Firestore Listener For Gift Items For Specific Person
    useEffect(() => {
        if (!authState.user || !personId) { return }; // Guard

        const collRef = getGiftItemsCollRef(authState.user.uid);
        const q = query(collRef, where('personId', '==', personId));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data() as GiftItem;
                return data
            });

            setGiftItems(items);
        }, (error) => {
            console.error('Error listening to gift items. Error:', error);
        });

        return () => unsubscribe();
    }, [authState.user, personId]);

    const handleDelete = async () => {

        if (!authState.user) { return }; // Auth Guard Clause
        if (!personId) { return }; // PersonID Guard Clause

        if (!window.confirm(`Are you sure you want to delete ${person.name}?`)) {
            return;
        }

        try {
            const docRef = getPersonDocRef(authState.user?.uid, personId);
            await deleteDoc(docRef);

            console.log('Successfully deleted person');

            setTimeout(() => {
                navigate('/people');
            }, 500)
        } catch (error) {
            console.error('Error Deleting Person. Error:', error);
        }
    }

    if (peopleLoading) {
        return <div>Loading Person...</div>
    }

    return (
        <section className={styles.personPage}>

            <header className={styles.personPageHeader}>
                <Link to={`/people`} className='unstyled-link'>
                    <ArrowLeft /> People
                </Link>

                {person && person.name && (
                    <h3>{person.name} {person.relationship && (`(${person.relationship})`)}</h3>
                )}

                <div className={styles.actionButtonsContainer}>
                    {/* Delete Button (Deletes Person) */}
                    <button
                        type='button'
                        onClick={handleDelete}
                        className='unstyled-button'
                    >
                        <Trash2
                            color='#dc3545'
                            size={26}
                        />
                    </button>

                    {/* Edit Button. Opens editEventModal */}
                    <button 
                        type='button'
                        className={styles.editButton}
                        onClick={() => { setEditPersonModalData(person || DEFAULT_PERSON); setIsEditPersonModalOpen(true); }}
                    >
                        <Pencil /> Edit
                    </button>
                </div>
            </header>

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

                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{giftIdeasCount}</div>
                        <div className={styles.statLabel}>Gift Ideas</div>
                    </div>
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

            </div>

            <div className={styles.giftItems}>
                <header className={styles.sectionHeader}>
                    <h4>Gift Items</h4>
                    <QuickAddButton
                        className={styles.personPageQuickAddButton}
                    />
                </header>

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

            <EditPersonModal
                isOpen={isEditPersonModalOpen}
                onClose={() => setIsEditPersonModalOpen(false)}
                data={editPersonModalData}
            />
        </section>
    )
}