import { Link, useNavigate, useParams } from 'react-router'
import styles from './PersonPage.module.css'
import { useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPersonDocRef } from '../../firebase/firestore';
import { deleteDoc } from 'firebase/firestore';
import { Person } from '../../types/PersonType';
import { getDaysUntilDate } from '../../utils';
import { useUpcomingEvents } from '../../hooks/useUpcomingEvents';
import { useEvents } from '../../contexts/EventsContext';
import { usePeople } from '../../contexts/PeopleContext';
import { GiftItemsTable } from '../../components/GiftItemsTable/GiftItemsTable';
import { useViewport } from '../../contexts/ViewportContext';
import { GiftItemCard } from '../../components/GiftItemCard/GiftItemCard';
import { QuickAddButton } from '../../components/ui/QuickAddButton/QuickAddButton';
import { ArrowLeft, Pencil, Plus, Trash2 } from 'lucide-react';
import { DEFAULT_PERSON } from '../../constants/defaultObjects';
import { EditPersonModal } from '../../components/modals/EditPersonModal/EditPersonModal';
import { AddEventModal } from '../../components/modals/AddEventModal/AddEventModal';
import { useGiftItems } from '../../contexts/GiftItemsContext';

export function PersonPage() {
    const { authState } = useAuth();
    const { personId } = useParams();
    const deviceType = useViewport();
    const { people, loading: peopleLoading } = usePeople();
    const { loading: eventsLoading } = useEvents();
    const upcomingEvents = useUpcomingEvents(personId);
    const { giftItems } = useGiftItems();
    const navigate = useNavigate();

    // State For Modals:
    const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState<boolean>(false);
    const [editPersonModalData, setEditPersonModalData] = useState<Person>(DEFAULT_PERSON);
    const [isAddEventModalOpen, setIsAddEventModalOpen] = useState<boolean>(false);
    
    // Gift Items Array for PersonId
    const filteredGiftItems = useMemo(() => {
        return giftItems.filter(item => item.personId === personId);
    }, [personId, giftItems]);

    // Person Data for PersonId
    const person = useMemo(() => {
        return people.find(p => p.id === personId) || { ...DEFAULT_PERSON }; // Return empty "person" if .find() can't find the personId.
    }, [personId, people])

    const handleDelete = async () => {
        if (!authState.user) { return }; // Auth Guard Clause
        if (!personId) { return }; // PersonID Guard Clause

        if (!window.confirm(`Are you sure you want to delete ${person.name}?`)) {
            return; // Confirm Window
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
                        <div className={styles.statNumber}>{filteredGiftItems.length}</div>
                        <div className={styles.statLabel}>Gift Items</div>
                    </div>
                </div>

                <div className={styles.sectionContainer}>
                    <header className={styles.sectionHeader}>
                        <h4>Upcoming Dates</h4>
                        <button type='button' className='unstyled-button' onClick={() => setIsAddEventModalOpen(true)}>
                            <Plus />
                        </button>
                    </header>
                    <div className={styles.sectionData}>
                        {eventsLoading ? (
                            <p>Loading events...</p>
                        ) : upcomingEvents.length === 0 ? (
                            <p>No upcoming dates.  Please add an important date.</p>
                        ) : (
                            upcomingEvents.map((event) => (
                                <div key={event.id} className={styles.eventContainer}>
                                    <span>
                                        <strong>
                                            <Link to={`/events/${event.id}`} key={event.id} className='unstyled-link'>
                                                {event.title}
                                            </Link>
                                        </strong>
                                         - {event.date}
                                    </span>
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
                        {filteredGiftItems.map((item) => (
                            <GiftItemCard
                                key={item.id}
                                item={item}
                            />
                        ))}
                    </>
                )}
                {deviceType === 'desktop' && ( <GiftItemsTable data={filteredGiftItems} /> )}         
            </div>

            <EditPersonModal
                isOpen={isEditPersonModalOpen}
                onClose={() => setIsEditPersonModalOpen(false)}
                data={editPersonModalData}
            />

            <AddEventModal
                isOpen={isAddEventModalOpen}
                onClose={() => setIsAddEventModalOpen(false)}
            />
        </section>
    )
}