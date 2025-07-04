import { Trash2 } from 'lucide-react';
import { GiftItem } from '../../types/GiftListType'
import styles from './GiftItemCard.module.css'
import { useAuth } from '../../contexts/AuthContext';
import { getGiftItemDocRef, getGiftListDocRef } from '../../firebase/firestore';
import { serverTimestamp, UpdateData, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useEvents } from '../../contexts/EventsContext';
import { useUpcomingEvents } from '../../hooks/useUpcomingEvents';
import { useEffect, useState } from 'react';
import { Event } from '../../types/EventType';

export function GiftItemCard({ item, giftListId } : { item: GiftItem, giftListId: string }) {
    const { authState } = useAuth();
    const { events } = useEvents();
    const upcomingEvents = useUpcomingEvents();

    const [upcomingEventsForPerson, setUpcomingEventsForPerson] = useState<Event[]>([]);

    // Figure out upcoming events for personId
    useEffect(() => {
        if (!upcomingEvents || !events || events.length === 0 || !item.personId) { return }; // Guard Clause

        const eventsData = upcomingEvents.filter(event => event.people.includes(item.personId))
        setUpcomingEventsForPerson(eventsData);
    }, [upcomingEvents, item.personId])

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

            const docRef = getGiftItemDocRef(authState.user.uid, giftListId, item.id);
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

    const handleDropdownChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Guard Clause
        if (!authState.user || !giftListId || !item.id) { return; };

        const { name, value } = e.target;

        try {
            const batch = writeBatch(db);

            const docRef = getGiftItemDocRef(authState.user.uid, giftListId, item.id);
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

            const docRef = getGiftItemDocRef(authState.user.uid, giftListId, item.id);
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
                onChange={handleDropdownChange}
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
                onBlur={handleItemSave}
                onKeyDown={handleItemSave}
                className={`
                    ${styles.inputText}
                    ${item.status === 'purchased' ? styles.purchased : ''}
                    `} 
            />

            {/* Estimated/Purchased Price */}
            {/* Possibly show estimated when item is an "idea", and "purchasedPrice" if item is "purchased" */}
            <label>cost
            <input
                type='number'
                name={item.status === 'purchased' ? 'purchasedCost' : 'estimatedCost'} // 1 Input for both estimated & purchased cost
                step='0.01' // for 'cents'
                min='0'
                placeholder='$0.00'
                defaultValue={item.status === 'purchased' ? 
                    (item.purchasedCost ? item.purchasedCost / 100 : '') :
                    (item.estimatedCost ? item.estimatedCost / 100 : '')
                }
                onBlur={handleItemSave}
                className={styles.inputText}
            />
            </label>

            {/* Only show events if item has been *purchased* */}
            {item.status === 'purchased' && (
                <select
                name='eventId'
                value={item.eventId}
                onChange={handleDropdownChange}
                className={`
                    ${styles.inputText}
                    ${item.status === 'purchased' ? styles.purchased : ''}
                    `}
                >
                {/* 1 Blank Option, then through all the options that make sense. */}
                    <option
                        className={styles.option}
                        value=''
                    >
                        Choose An Event
                    </option>

                    {upcomingEventsForPerson.map(event => (
                        <option
                            key={event.id}
                            className={styles.option}
                            value={event.id}
                        >
                            {event.title}
                        </option>
                    ))}
                </select>
            )}


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