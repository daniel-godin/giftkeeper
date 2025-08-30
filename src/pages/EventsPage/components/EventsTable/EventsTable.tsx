import { useState } from 'react';
import { useEvents } from '../../../../contexts/EventsContext';
import { Event } from '../../../../types/EventType';
import styles from './EventsTable.module.css';
import { DEFAULT_EVENT } from '../../../../constants/defaultObjects';
import { Link } from 'react-router';
import { formatBirthdayShort, getDaysUntilDate, getEventUrgency } from '../../../../utils';
import { formatCurrency } from '../../../../utils/currencyUtils';
import { EditEventModal } from '../../../../components/modals/EditEventModal/EditEventModal';
import { Pencil, Trash2 } from 'lucide-react';

interface EventsTableProps {
    events: Event[];
    giftStatsByEvent: Record<string, { giftCount: number; totalSpent: number }>
}

export function EventsTable({ events, giftStatsByEvent } : EventsTableProps) {
    const { loading: loadingEvents } = useEvents();
    // const { deletePerson } = usePeopleActions();

    // Modal State
    const [isEditEventModalOpen, setIsEditEventModalOpen] = useState<boolean>(false);
    const [eventBeingEdited, setEventBeingEdited] = useState<Event>(DEFAULT_EVENT);

    const handleEditableItem = (event: Event) => {
        setEventBeingEdited(event);
        setIsEditEventModalOpen(true);
    }

    const handleDelete = async (event: Event) => {
        // await deletePerson(person);
    }

    return (
        <div className={styles.eventsTableContainer}>

            {/* Table With People Data */}
            {loadingEvents ? (
                <SkeletonTable rows={5} />
            ) : (
                <table className={styles.eventsTable}>
                    <thead className={styles.tableHeader}>
                        <tr className={styles.tableRow}>
                            <th>TITLE</th>
                            <th>TYPE</th>
                            <th>DATE</th>
                            <th>GIFTS</th>
                            <th>SPENT</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map(event => (
                            <tr key={event.id} className={styles.tableRow}>
                                {/* Event Title + First Letter Avatar */}
                                <td className={styles.tableCell}>
                                    <Link to={`/events/${event.id}`} className={`unstyled-link ${styles.eventTitle}`}>
                                        <div className={styles.titleWithAvatar}>
                                            <div className={styles.avatar}>{event.title.slice(0, 1)}</div>
                                            {event.title}
                                        </div>
                                    </Link>
                                </td>

                                {/* TODO:  Improve/writeout event types. */}
                                {/* Event Type (birthday, holiday, etc.) */}
                                <td className={styles.tableCell}>
                                    {event.type && (<span className={styles.eventTypeTag}>{event.type}</span>)}
                                </td>

                                {/* Event Date Information */}
                                <td className={styles.tableCell}>
                                    {event.date && (
                                        <div className={styles.eventDateInfo}>
                                            <div className={styles.eventDate}>{formatBirthdayShort(event.date)}</div>
                                            {getDaysUntilDate(event.date) ? (
                                                <div 
                                                    className={`${styles.eventCountdown} ${styles[getEventUrgency(event.date, '')]}`}
                                                >
                                                    {getDaysUntilDate(event.date)} days away
                                                </div>
                                            ) : (
                                                <div className={styles.eventCountdown}>--</div>
                                            )}
                                        </div>
                                    )}
                                </td>

                                {/* Number of Gifts For Each Event (event.id) */}
                                <td className={styles.tableCell}>
                                    {event.id && giftStatsByEvent && giftStatsByEvent[event.id] && (
                                        <span className={styles.giftCount}>{giftStatsByEvent[event.id].giftCount}</span>
                                    )}
                                </td>

                                {/* Total Spent On Event */}
                                <td className={styles.tableCell}>
                                    {event.id && giftStatsByEvent && giftStatsByEvent[event.id] && (
                                        <span className={styles.spentAmount}>{formatCurrency(giftStatsByEvent[event.id].totalSpent)}</span>
                                    )}
                                </td>

                                {/* Actions:  Edit/Delete Event */}
                                <td className={styles.tableCell}>
                                    <div className={styles.actionButtonsContainer}>

                                        {/* Edit Button -- Opens "EditEventModal" */}
                                        <button 
                                            type='button'
                                            className='unstyled-button'
                                            onClick={() => handleEditableItem(event) }
                                        >
                                            <Pencil />
                                        </button>

                                        {/* Delete Button -- Deletes Event */}
                                        <button 
                                            type='button'
                                            className='unstyled-button'
                                            onClick={() => handleDelete(event) }
                                        >
                                            <Trash2
                                                color='#dc3545'
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            <EditEventModal
                isOpen={isEditEventModalOpen}
                onClose={() => setIsEditEventModalOpen(false)}
                data={eventBeingEdited}
            />
        </div>
    )

}

const SkeletonTable = ({ rows = 5 }) => {

    return (
        <table className={styles.eventsTable}>
            <thead className={styles.tableHeader}>
                <tr>
                    <th>NAME</th>
                    <th>TYPE</th>
                    <th>BIRTHDAY</th>
                    <th>GIFTS</th>
                    <th>SPENT</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {Array(rows).fill(0).map((_, i) => (
                    <tr key={i} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                            <div className="skeleton-line" style={{ width: '100%' }} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>  
    )
}