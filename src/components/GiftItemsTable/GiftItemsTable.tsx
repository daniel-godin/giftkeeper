import { Check, Lightbulb } from 'lucide-react';
import { GiftItem } from '../../types/GiftListType'
import styles from './GiftItemsTable.module.css'
import { capitalizeFirst } from '../../utils/stringUtils';
import { EditGiftItemModal } from '../modals/EditGiftItemModal/EditGiftItemModal';
import { useState } from 'react';
import { formatCurrency } from '../../utils/currencyUtils';
import { DEFAULT_GIFT_ITEM } from '../../constants/defaultObjects';

interface GiftItemsTableProps {
    data: GiftItem[];
}

export function GiftItemsTable({ data } : GiftItemsTableProps) {
    const [isEditGiftItemModalOpen, setIsEditGiftItemModalOpen] = useState<boolean>(false);
    const [giftItemBeingEdited, setGiftItemBeingEdited] = useState<GiftItem>(DEFAULT_GIFT_ITEM)

    const handleEditableItem = (item: GiftItem) => {
        setGiftItemBeingEdited(item);
        setIsEditGiftItemModalOpen(true);
    } 

    if (data.length === 0) {
        return (<div>No Gift Items Found.</div>)
    }

    if (data.length > 0) {
        return (
            <table className={styles.giftItemsTable}>
                <thead className={styles.tableHead}>
                    <tr className={`${styles.tableHeadRow} ${styles.tableRow}`}>
                        <th scope='col'>PERSON</th>
                        <th scope='col'>GIFT ITEM</th>
                        <th scope='col'>STATUS</th>
                        <th scope='col'>COST</th> 
                        <th scope='col'>ACTION</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {data && (
                        data.map(item => (
                            <tr key={item.id}>
                                <td>{item.personName}</td>
                                <td>{item.name}</td>

                                {/* Conditional Rendering Based on Status. idea = estimatedCost, purchased = purchasedCost */}
                                {item.status === 'idea' ? (
                                    <>
                                        <td className={styles.giftItemDetailIdea}><Lightbulb size={20}/> {capitalizeFirst(item.status)}</td>
                                        <td>{formatCurrency(item.estimatedCost || 0)}</td>
                                    </>
                                ) : item.status === 'purchased' && ( // Means "not" idea, only other option is "purchased".
                                    <>
                                        <td className={styles.giftItemDetailPurchased}><Check size={20}/> {capitalizeFirst(item.status)}</td>
                                        <td>{formatCurrency(item.purchasedCost || 0)}</td>
                                    </>
                                )}
                                <td>
                                    <button type='button' className={styles.actionsButton} onClick={() => handleEditableItem(item)}>
                                        Edit Item
                                    </button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>

                {/* Edit Gift Item Modal */}
                <EditGiftItemModal
                    isOpen={isEditGiftItemModalOpen}
                    onClose={() => setIsEditGiftItemModalOpen(false)}
                    data={giftItemBeingEdited}
                />
            </table>
        )
    }
}