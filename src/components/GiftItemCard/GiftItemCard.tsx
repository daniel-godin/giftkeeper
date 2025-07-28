import { Check, ExternalLink, Lightbulb } from 'lucide-react';
import { GiftItem } from '../../types/GiftType'
import styles from './GiftItemCard.module.css'
import { capitalizeFirst } from '../../utils/stringUtils';
import { formatCurrency } from '../../utils/currencyUtils';
import { useState } from 'react';
import { EditGiftItemModal } from '../modals/EditGiftItemModal/EditGiftItemModal';
import { useEvents } from '../../contexts/EventsContext';
import { Link } from 'react-router';

interface GiftItemCardProps {
    item: GiftItem;
}

export function GiftItemCard({ item } : GiftItemCardProps) {
    const { events } = useEvents();

    const [isEditGiftItemModalOpen, setIsEditGiftItemModalOpen] = useState<boolean>(false);

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
                <button type='button' className={styles.actionsButton} onClick={() => setIsEditGiftItemModalOpen(true)}>Edit Item</button>
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