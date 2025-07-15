import { Check, ExternalLink, Lightbulb } from 'lucide-react';
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

    // Return Nothing If No Data in Data Array
    if (data.length === 0) { return (<div>No Gift Items Found.</div>) }

    return (
        <>
            <table className={styles.giftItemsTable}>
                <thead className={styles.tableHead}>
                    <tr className={`${styles.tableHeadRow} ${styles.tableRow}`}>
                        <th scope='col' className={styles.tableCell}>PERSON</th>
                        <th scope='col' className={styles.tableCell}>GIFT ITEM</th>
                        <th scope='col' className={styles.tableCell}>LINK</th> 
                        <th scope='col' className={styles.tableCell}>STATUS</th>
                        <th scope='col' className={styles.tableCell}>COST</th> 
                        <th scope='col' className={styles.tableCell}>ACTION</th>
                    </tr>
                </thead>
                <tbody className={styles.tableBody}>
                    {data.map(item => (
                        <tr key={item.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>{item.personName}</td>
                            <td className={styles.tableCell}>{item.name}</td>
          
                            {/* Link is based on item.url */}
                            <td className={styles.tableCell}>
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
                            </td>

                            {/* Conditional Rendering Based on Status. idea = estimatedCost, purchased = purchasedCost */}
                            {item.status === 'idea' && (
                                <>
                                    <td className={`${styles.tableCell}`}><span className={styles.giftItemDetailIdea}><Lightbulb size={20}/> {capitalizeFirst(item.status)}</span></td>
                                    <td className={styles.tableCell}>{formatCurrency(item.estimatedCost || 0)}</td>
                                </>
                            )}
                            {/* status === purchased = purchasedCost & Different Display */}
                            {item.status === 'purchased' && (
                                <>
                                    <td className={`${styles.tableCell}`}><span className={styles.giftItemDetailPurchased}><Check size={20}/> {capitalizeFirst(item.status)}</span></td>
                                    <td className={styles.tableCell}>{formatCurrency(item.purchasedCost || 0)}</td>
                                </>
                            )}



                            <td className={styles.tableCell}>
                                <button type='button' className={styles.actionsButton} onClick={() => handleEditableItem(item)}>
                                    Edit Item
                                </button>
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