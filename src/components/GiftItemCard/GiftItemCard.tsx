import { Trash2 } from 'lucide-react';
import { GiftItem } from '../../types/GiftListType'
import styles from './GiftItemCard.module.css'
import { useAuth } from '../../contexts/AuthContext';
import { getGiftItemDoc, getGiftListDocRef } from '../../firebase/firestore';
import { serverTimestamp, UpdateData, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export function GiftItemCard({ item, giftListId } : { item: GiftItem, giftListId: string }) {
    const { authState } = useAuth();

    // Established Item Name Change
    // const handleItemSave = async (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, item: GiftItem, fieldName: string) => {
    const handleItemSave = async (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>) => {
        // Keyboard Event Clause:
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') { return; } ;

        // Guard Clause
        if (!authState.user || !giftListId || !item.id) { return; };

        const { name, value } = e.target as HTMLInputElement;

        if (!value.trim()) {
            (e.target as HTMLInputElement).value = item.name; // Resets to original if empty text input box
            return;
        }

        try {
            const batch = writeBatch(db);

            const docRef = getGiftItemDoc(authState.user.uid, giftListId, item.id);
            const newData: UpdateData<GiftItem> = {
                // [fieldName]: newValue,
                [name]: value.trim(),
                updatedAt: serverTimestamp()
            }

            const parentGiftListDocRef = getGiftListDocRef(authState.user.uid, giftListId);

            batch.update(docRef, newData);
            batch.update(parentGiftListDocRef, { updatedAt: serverTimestamp() });

            batch.commit();

            // Remove focus after Enter
            if (e.type === 'keydown') { (e.target as HTMLInputElement).blur(); }

        } catch (error) {
            console.error('Error saving item name/description. Error:', error);
        }
    }

    const handleItemStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Guard Clause
        if (!authState.user || !giftListId || !item.id) { return; };

        const { name, value } = e.target;

        try {
            const batch = writeBatch(db);

            const docRef = getGiftItemDoc(authState.user.uid, giftListId, item.id);
            const newData: UpdateData<GiftItem> = {
                [name]: value,
                updatedAt: serverTimestamp()
            }

            const parentGiftListDocRef = getGiftListDocRef(authState.user.uid, giftListId);

            batch.update(docRef, newData);
            batch.update(parentGiftListDocRef, { updatedAt: serverTimestamp() });

            batch.commit();

        } catch (error) {
            console.error('Error saving item status. Error:', error);
        }
    }

    const handleDeleteItem = async (item: GiftItem) => {
        // Guard Clauses:
        if (!authState.user || !giftListId || !item.id) { return; };

        try {
            const batch = writeBatch(db);

            const docRef = getGiftItemDoc(authState.user.uid, giftListId, item.id);
            const parentGiftListDocRef = getGiftListDocRef(authState.user.uid, giftListId);

            batch.delete(docRef);
            batch.update(parentGiftListDocRef, { updatedAt: serverTimestamp() });

            batch.commit();
        } catch (error) {
            console.error(`Error deleting Gift Item: ${item.id}. Error:`, error);
        }
    }

    return (
        <div className={styles.giftItemCard}>
            {/* Idea/Purchased Status */}
            <select
                name='status'
                defaultValue={item.status}
                onChange={handleItemStatusChange}
                className={`
                    ${styles.inputText}
                    ${item.status === 'purchased' ? styles.purchased : ''}
                    `}
            >
                <option
                    className={styles.option}
                    value='idea'
                >
                    Gift Idea
                </option>
                <option
                    className={styles.option}
                    value='purchased'
                >
                    Purchased
                </option>
            </select>

            {/* Gift Item Name/Description */}
            <input 
                type='text'
                name='name'
                defaultValue={item.name}
                // onBlur={(e) => handleItemSave(e, item, 'name')}
                // onKeyDown={(e) => handleItemSave(e, item, 'name')}
                onBlur={handleItemSave}
                onKeyDown={handleItemSave}
                className={`
                    ${styles.inputText}
                    ${item.status === 'purchased' ? styles.purchased : ''}
                    `} 
            />

            {/* Delete Gift Item Button (NOTE: No safety checks applied yet) */}
            <button
                className={styles.deleteItemButton}
                onClick={() => { handleDeleteItem(item); } }
            >
                <Trash2 color='red'/>
            </button>
        </div>
    )
}