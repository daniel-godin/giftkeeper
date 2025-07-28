import { Check, ExternalLink, Lightbulb, Pencil, Trash2 } from 'lucide-react';
import { GiftItem } from '../../types/GiftType'
import styles from './GiftItemsTable.module.css'
import { capitalizeFirst } from '../../utils/stringUtils';
import { EditGiftItemModal } from '../modals/EditGiftItemModal/EditGiftItemModal';
import { useState } from 'react';
import { formatCurrency } from '../../utils/currencyUtils';
import { DEFAULT_GIFT_ITEM } from '../../constants/defaultObjects';
import { useEvents } from '../../contexts/EventsContext';
import { useAuth } from '../../contexts/AuthContext';
import { getGiftItemDocRef } from '../../firebase/firestore';
import { deleteDoc } from 'firebase/firestore';

interface GiftItemsTableProps {
    data: GiftItem[];
}

export function GiftItemsTable({ data } : GiftItemsTableProps) {
    const { authState } = useAuth();
    const { events } = useEvents();

    const [isEditGiftItemModalOpen, setIsEditGiftItemModalOpen] = useState<boolean>(false);
    const [giftItemBeingEdited, setGiftItemBeingEdited] = useState<GiftItem>(DEFAULT_GIFT_ITEM)

    const handleEditableItem = (item: GiftItem) => {
        setGiftItemBeingEdited(item);
        setIsEditGiftItemModalOpen(true);
    } 

    const handleDelete = async (giftItem: GiftItem) => {
        if (!authState.user) { return }; // Auth Guard Clause
        if (!giftItem || !giftItem.id) { return }; // Data Guard Clause

        if (!window.confirm(`Are you sure you want to delete ${giftItem.name}?`)) {
            return;
        }

        try {
            const docRef = getGiftItemDocRef(authState.user.uid, giftItem.id);
            await deleteDoc(docRef);

            console.log('Successfully deleted gift item');

        } catch (error) {
            console.error('Error Deleting Gift Item. Error:', error);
        }
    }

    // Return Nothing If No Data in Data Array
    if (data.length === 0) { return (<div>No Gift Items Found.</div>) }

    return (
        <>
            <table className={styles.giftItemsTable}>
                <thead className={styles.tableHead}>
                    <tr className={`${styles.tableHeadRow} ${styles.tableRow}`}>
                        <th scope='col' className={styles.tableCell}>PERSON</th>
                        <th scope='col' className={styles.tableCell}>GIFT ITEM</th>
                        <th scope='col' className={styles.tableCell}>STATUS</th>
                        <th scope='col' className={styles.tableCell}>EVENT</th>
                        <th scope='col' className={styles.tableCell}>COST</th> 
                        <th scope='col' className={styles.tableCell}>ACTION</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {data.map(item => (
                        <tr key={item.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{item.personName}</td>

                            {/* Item Name & Conditional URL Link: */}
                            <td className={`${styles.tableCell} ${styles.nameAndURL}`}>
                                <span>{item.name}</span>                            
                                {item.url && (
                                    <a
                                        href={item.url}
                                        target='_blank'
                                        className={styles.linkIcon}
                                        title='View Item Online'
                                    >
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </td>

                            {/* Conditional Rendering Based on Status. idea = estimatedCost, purchased = purchasedCost */}
                            {item.status === 'idea' && (
                                <>
                                    <td className={`${styles.tableCell}`}><span className={styles.giftItemDetailIdea}><Lightbulb size={20}/> {capitalizeFirst(item.status)}</span></td>
                                    {/* Event Data: */}
                                    {item.eventId ? (
                                        <td className={styles.tableCell}>
                                            {/* TODO:  Possibly useMemo this later. */}
                                            {events.find(event => event.id === item.eventId)?.title || 'Event Not Found'}
                                        </td>
                                    ) : (
                                        <td className={styles.tableCell}>--</td>
                                    )}
                                    <td className={styles.tableCell}>{formatCurrency(item.estimatedCost || 0)}</td>
                                </>
                            )}

                            {/* status === purchased = purchasedCost & Different Display */}
                            {item.status === 'purchased' && (
                                <>
                                    <td className={`${styles.tableCell}`}><span className={styles.giftItemDetailPurchased}><Check size={20}/> {capitalizeFirst(item.status)}</span></td>
                                    {/* Event Data: */}
                                    {item.eventId ? (
                                        <td className={styles.tableCell}>
                                            {/* TODO:  Possibly useMemo this later. */}
                                            {events.find(event => event.id === item.eventId)?.title || 'Event Not Found'}
                                        </td>
                                    ) : (
                                        <td className={styles.tableCell}>--</td>
                                    )}
                                    <td className={styles.tableCell}>{formatCurrency(item.purchasedCost || 0)}</td>
                                </>
                            )}

                            {/* Action Buttons: */}
                            <td className={styles.tableCell}>
                                <div className='basic-flexbox'>
                                    {/* Delete Button -- Deletes Gift Item */}
                                    <button 
                                        type='button'
                                        className='unstyled-button'
                                        onClick={() => handleDelete(item) }
                                    >
                                        <Trash2
                                            color='#dc3545'
                                        />
                                    </button>

                                    {/* Edit Button -- Opens "EditGiftItemModal" */}
                                    <button 
                                        type='button'
                                        className='unstyled-button'
                                        onClick={() => handleEditableItem(item) }
                                    >
                                        <Pencil />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Gift Item Modal */}
            <EditGiftItemModal
                isOpen={isEditGiftItemModalOpen}
                onClose={() => setIsEditGiftItemModalOpen(false)}
                data={giftItemBeingEdited}
            />
        </>
    )
}