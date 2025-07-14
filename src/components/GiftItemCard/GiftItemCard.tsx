import { Check, Lightbulb } from 'lucide-react';
import { GiftItem } from '../../types/GiftListType'
import styles from './GiftItemCard.module.css'
import { capitalizeFirst } from '../../utils/stringUtils';
import { formatCurrency } from '../../utils/currencyUtils';
import { useState } from 'react';
import { EditGiftItemModal } from '../modals/EditGiftItemModal/EditGiftItemModal';

interface GiftItemCardProps {
    item: GiftItem;
}

export function GiftItemCard({ item } : GiftItemCardProps) {
    const [isEditGiftItemModalOpen, setIsEditGiftItemModalOpen] = useState<boolean>(false);

    return (
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
                <span className={styles.giftItemCategory}>
                    {item.status === 'idea' && (<>Estimated Cost</>)}
                    {item.status === 'purchased' && (<>Purchased Cost</>)}
                </span>
                <span className={styles.giftItemDetail}>{formatCurrency(item.purchasedCost || 0)}</span>
            </div>
            <div className={styles.giftItemCardRow}>
                <span className={styles.giftItemCategory}></span>
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