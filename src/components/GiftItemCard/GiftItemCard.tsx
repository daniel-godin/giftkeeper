import { Trash2 } from 'lucide-react';
import { GiftItem } from '../../types/GiftListType'
import styles from './GiftItemCard.module.css'
import { useAuth } from '../../contexts/AuthContext';
import { getGiftItemDoc } from '../../firebase/firestore';
import { deleteDoc, serverTimestamp, UpdateData, updateDoc } from 'firebase/firestore';

export function GiftItemCard({ item, giftListId } : { item: GiftItem, giftListId: string }) {
    const { authState } = useAuth();

    // Established Item Name Change
    const handleItemSave = async (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, item: GiftItem, fieldName: string) => {
        // Keyboard Event Clause:
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') { return; } ;

        // Guard Clause
        if (!authState.user || !giftListId || !item.id) { return; };

        const newValue = (e.target as HTMLInputElement).value.trim();

        try {
            const docRef = getGiftItemDoc(authState.user.uid, giftListId, item.id);
            const newData: UpdateData<GiftItem> = {
                [fieldName]: newValue,
                updatedAt: serverTimestamp()
            }

            await updateDoc(docRef, newData)

            // Remove focus after Enter
            if (e.type === 'keydown') { (e.target as HTMLInputElement).blur(); }

        } catch (error) {
            console.error('Error saving item. Error:', error);
        }
    }

    const handleDeleteItem = async (item: GiftItem) => {
        // Guard Clauses:
        if (!authState.user || !giftListId || !item.id) { return; };

        try {
            const docRef = getGiftItemDoc(authState.user.uid, giftListId, item.id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting Gift Item: ${item.id}. Error:`, error);
        }
    }

    return (
        <div className={styles.giftItemCard}>
            <input 
                type='text'
                defaultValue={item.name}
                onBlur={(e) => handleItemSave(e, item, 'name')}
                onKeyDown={(e) => handleItemSave(e, item, 'name')}
                className={`
                    ${styles.inputText}
                    ${item.status === 'purchased' ? styles.purchased : ''}
                    `} 
                />
            <button
                className={styles.deleteItemButton}
                onClick={() => { handleDeleteItem(item); } }
            >
                <Trash2 color='red'/>
            </button>
        </div>
    )
}