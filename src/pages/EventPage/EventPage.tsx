import { useMemo, useState } from 'react';
import styles from './EventPage.module.css'
import { Link, useNavigate, useParams } from 'react-router';
import { deleteDoc } from 'firebase/firestore';
import { useEvents } from '../../contexts/EventsContext';
import { Event } from '../../types/EventType';
import { usePeople } from '../../contexts/PeopleContext';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { getDaysUntilDate } from '../../utils';
import { formatCurrency } from '../../utils/currencyUtils';
import { GiftItemCard } from '../../components/GiftItemCard/GiftItemCard';
import { useViewport } from '../../contexts/ViewportContext';
import { GiftItemsTable } from '../../components/GiftItemsTable/GiftItemsTable';
import { getEventDocRef } from '../../firebase/firestore';
import { QuickAddButton } from '../../components/ui/QuickAddButton/QuickAddButton';
import { EditEventModal } from '../../components/modals/EditEventModal/EditEventModal';
import { DEFAULT_EVENT } from '../../constants/defaultObjects';
import { useAuth } from '../../contexts/AuthContext';
import { useGiftItems } from '../../contexts/GiftItemsContext';

export function EventPage() {
    const { authState } = useAuth();
    const { eventId } = useParams();
    const deviceType = useViewport();
    const { events } = useEvents();
    const { people  } = usePeople();
    const { giftItems, loading: giftItemsLoading } = useGiftItems();
    const navigate = useNavigate();

    // State For EditEventModal:
    const [isEditEventModalOpen, setIsEditEventModalOpen] = useState<boolean>(false);
    const [editEventModalData, setEditEventModalData] = useState<Event>(DEFAULT_EVENT);

    // Event Details for EventId:
    const event = useMemo(() => {
        return events.find(event => event.id === eventId);
    }, [eventId, events]);

    // Participant Details For EventId
    const participantNames = useMemo(() => {
        if (!event || !event.people) { return [] }; // Guard/Optimization Clause

        const filteredPeople = people.filter(p => event.people.includes(p.id || ''));
        return filteredPeople.map(person => {
            return {
                id: person.id || '',
                name: person.nickname || person.name || 'Unknown'
            }
        })
    }, [event?.people, people])

    // Gift Items Array for EventId
    const filteredGiftItems = useMemo(() => {
        return giftItems.filter(item => item.eventId === eventId);
    }, [eventId, giftItems]);

    // Budget Calculations: Event Budget, Total of Purchased Items, Difference Between Those Two.
    const budgetCalculations = useMemo(() => {
        if (!filteredGiftItems || filteredGiftItems.length === 0 || !event || !event.budget) { return }; // Guard/Optimization Clause

        const totalPurchased = filteredGiftItems.reduce((sum, item) => {
            return sum + (item.purchasedCost || 0);
        }, 0)

        return {
            eventBudget: event.budget,
            totalPurchased: totalPurchased,
            budgetLeft: event.budget - totalPurchased
        }
    }, [filteredGiftItems, event?.budget])

    const handleDelete = async () => {

        if (!authState.user || !event || !eventId) { return }; // Auth Guard Clause

        if (!window.confirm(`Are you sure you want to delete ${event.title}?`)) {
            return;
        }

        try {
            const docRef = getEventDocRef(authState.user.uid, eventId);
            await deleteDoc(docRef);

            console.log('Successfully deleted event');

            setTimeout(() => {
                navigate('/events');
            }, 500)
        } catch (error) {
            console.error('Error Deleting Event. Error:', error);
        }
    }

    return (
        <section className={styles.eventPage}>
            <header className={styles.eventPageHeader}>
                <Link to={`/events`} className='unstyled-link'>
                    <ArrowLeft /> Events
                </Link>

                {event && event.title && (
                    <h3>{event.title}</h3>
                )}

                <div className={styles.actionButtonsContainer}>
                    {/* Delete Button (Deletes Event) */}
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
                        onClick={() => { setEditEventModalData(event || DEFAULT_EVENT); setIsEditEventModalOpen(true); }}
                    >
                        <Pencil /> Edit
                    </button>
                </div>
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
                                {participantNames.map(person => (
                                    <Link to={`/people/${person.id}`} key={person.id} className='unstyled-link'>
                                        {`${person.name} `}
                                    </Link>
                                ))}

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

            {/* "Notes" Section -- Only Render If Notes Aren't Empty */}
            {event && event.notes && (
                <div className={styles.sectionContainer}>
                    <header className={styles.sectionHeader}>
                        <h4>Notes</h4>
                    </header>

                    <div className={styles.notes}>
                        {event.notes}
                    </div>

                </div>
            )}

            <div className={styles.giftTrackerContainer}>
                {giftItemsLoading ? (
                    <div>Loading Gift Items...</div>
                ) : (
                    <>
                        <header className={styles.giftTrackerHeader}>
                            <h3>Gift Tracker</h3>
                            <QuickAddButton

                            />
                        </header>

                        {/* Needs two versions: Mobile & Desktop. Mobile uses Cards, Desktop uses Table */}
                        {deviceType === 'mobile' && (
                            <div className={styles.giftItemList}>
                                {/* Map through associated gift items */}
                                {filteredGiftItems.map((item) => (
                                    <GiftItemCard
                                        key={item.id}
                                        item={item}
                                    />
                                ))}
                            </div>
                        )}

                        {deviceType === 'desktop' && (
                            <GiftItemsTable
                                data={filteredGiftItems}
                            />
                        )}

                    </>
                )}
            </div>

            <EditEventModal
                isOpen={isEditEventModalOpen}
                onClose={() => setIsEditEventModalOpen(false)}
                data={editEventModalData}
            />
        </section>
    )
}