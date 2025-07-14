import { Check, Lightbulb } from 'lucide-react';
import { GiftItem } from '../../types/GiftListType'
import styles from './GiftItemCard.module.css'
import { capitalizeFirst } from '../../utils/stringUtils';
import { formatCurrency } from '../../utils/currencyUtils';

interface GiftItemCardProps {
    item: GiftItem;
}

export function GiftItemCard({ item } : GiftItemCardProps) {

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
                <span className={styles.giftItemCategory}>Cost</span>
                <span className={styles.giftItemDetail}>{formatCurrency(item.purchasedCost || 0)}</span>
            </div>
        </div>
    )
}