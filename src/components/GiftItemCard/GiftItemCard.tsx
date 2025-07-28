import { Check, ExternalLink, Lightbulb, Pencil, Trash2 } from 'lucide-react';
import { GiftItem } from '../../types/GiftType'
import styles from './GiftItemCard.module.css'
import { capitalizeFirst } from '../../utils/stringUtils';
import { formatCurrency } from '../../utils/currencyUtils';
import { useState } from 'react';
import { EditGiftItemModal } from '../modals/EditGiftItemModal/EditGiftItemModal';
import { useEvents } from '../../contexts/EventsContext';
import { Link } from 'react-router';
import { useAuth } from '../../contexts/AuthContext';
import { getGiftItemDocRef } from '../../firebase/firestore';
import { deleteDoc } from 'firebase/firestore';

interface GiftItemCardProps {
    item: GiftItem;
}

export function GiftItemCard({ item } : GiftItemCardProps) {
    const { authState } = useAuth();
    const { events } = useEvents();

    const [isEditGiftItemModalOpen, setIsEditGiftItemModalOpen] = useState<boolean>(false);

    const handleEditableItem = () => {
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

    return (
        <div key={item.id} className={styles.giftItemCard}>
            {/* Person Name */}
            <div className={styles.giftItemCardRow}>
                <span className={styles.giftItemCategory}>Person</span>
                <span className={styles.giftItemDetail}>{item.personName}</span>
            </div>

            {/* Gift Item Name */}
            <div className={styles.giftItemCardRow}>
                <span className={styles.giftItemCategory}>Gift</span>
                <span className={styles.giftItemDetail}>{item.name}</span>
            </div>

            {/* Gift Status */}
            <div className={styles.giftItemCardRow}>
                <span className={styles.giftItemCategory}>Status</span>
                {item.status === 'idea' && (
                    <span className={styles.giftItemDetailIdea}><Lightbulb size={20}/> {capitalizeFirst(item.status)}</span>
                )}
                {item.status === 'purchased' && (
                    <span className={styles.giftItemDetailPurchased}><Check size={20} /> {capitalizeFirst(item.status)}</span>
                )}
            </div>

            {/* Event: */}
            <div className={styles.giftItemCardRow}>
                <span className={styles.giftItemCategory}>Event</span>
                <span className={styles.giftItemDetail}>
                    {item.eventId ? (
                        <Link to={`/events/${item.eventId}`} className='unstyled-link'>
                            {events.find(event => event.id === item.eventId)?.title || 'Event Not Found'}
                        </Link>
                    ) : (
                        <>--</>
                    )}
                </span>
            </div>

            {/* Costs */}
            <div className={styles.giftItemCardRow}>
                <span className={styles.giftItemCategory}>
                    {item.status === 'idea' && (<>Estimated Cost</>)}
                    {item.status === 'purchased' && (<>Purchased Cost</>)}
                </span>
                <span className={styles.giftItemDetail}>{formatCurrency(item.purchasedCost || 0)}</span>
            </div>

            {/* URL & Edit Button */}
            <div className={styles.giftItemCardRow}>
                <span className={styles.giftItemCategory}>                                
                    {item.url && (
                        <a
                            href={item.url}
                            target='_blank'
                            // className='unstyled-link'
                            title='View Item Online'
                        >
                            <ExternalLink size={16} />
                        </a>
                                )}
                </span>

                {/* Action Buttons: */}
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
                        onClick={() => handleEditableItem() }
                    >
                        <Pencil />
                    </button>
                </div>
            </div>
            
            {/* Edit Modal */}
            <EditGiftItemModal
                isOpen={isEditGiftItemModalOpen}
                onClose={() => setIsEditGiftItemModalOpen(false)}
                data={item}
            />

        </div>
    )
}