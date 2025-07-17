import { useEffect, useState } from 'react';
import { GiftItem } from '../../../types/GiftType';
import styles from './EditGiftItemModal.module.css'
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { serverTimestamp, UpdateData, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { getGiftItemDocRef, getGiftListDocRef } from '../../../firebase/firestore';
import { useUpcomingEvents } from '../../../hooks/useUpcomingEvents';
import { Event } from '../../../types/EventType';

interface EditGiftItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: GiftItem;
}

export function EditGiftItemModal({ isOpen, onClose, data } : EditGiftItemModalProps) {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<GiftItem>(data);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Get upcoming events for selected "person" to display in dropdown.  Default is '' per defaultFormValues.
    // eventOptions makes sure to grab personId if dropdown changed to 'purchased' & personId is valid. Otherwise empty array of <Event>[].
    const upcomingEventsForPersonId = useUpcomingEvents(data.personId);
    const eventOptions: Event[] = formData.status === 'purchased' && data.personId ? upcomingEventsForPersonId : [];

    useEffect(() => {
        if (isOpen) { setFormData(data) };
    }, [isOpen])

    // Default Input Change Handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;

        // Allow empty string for better UX
        if (value === '') { setFormData(prev => ({ ...prev, [name]: 0 })); return};

        // Prevent negative number, but still update
        const sanitizedValue = Math.max(0, numValue); // Returns larger between the two, so... if negative, returns 0.
        setFormData(prev => ({
            ...prev,
            [name]: Math.round(sanitizedValue * 100) // Convert to cents
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.user) { return }; // Guard Clause
        if (!formData.name.trim()) { return }; // Form Validation Guard Clause

        setIsSubmitting(true);
        setStatus('Updating Gift Item...');

        try {
            const batch = writeBatch(db); // Using batch to create GiftItem document & *update* parent GiftList updatedAt.

            if (!data || !data.id || !data.giftListId) { return };

            const giftItemDocRef = getGiftItemDocRef(authState.user.uid, data.giftListId, data.id);
            const giftItemDocumentData: UpdateData<GiftItem> = {
                name: formData.name,

                // Status & Associations
                status: formData.status,
                eventId: formData.eventId,
                url: validateURL(formData.url || ''),

                // // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
                estimatedCost: formData.estimatedCost,
                purchasedCost: formData.purchasedCost,

                // Metadata
                updatedAt: serverTimestamp()
            }

            const parentGiftListDocRef = getGiftListDocRef(authState.user.uid, data.giftListId);

            batch.update(giftItemDocRef, giftItemDocumentData);
            batch.update(parentGiftListDocRef, { updatedAt: serverTimestamp() });

            await batch.commit();

            setTimeout(() => {
                onClose();
                resetModal();
            }, 500);

        } catch (error) {
            console.error('Error Updating Gift Item. Error:', error);
            setStatus('Error Updating Gift Item. Try Again.');
            setIsSubmitting(false);
        }


    }

    // Resets All State In Modal
    const resetModal = () => {
        setStatus('');
        // setFormData(defaultFormValues);
        setIsSubmitting(false);
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.editGiftItemModal}>
                <header className={styles.header}>
                    <h2>Edit Gift Item</h2>
                    <button type='button' className={styles.closeModalButton} onClick={() => { onClose() }}>
                        <X size={30} />
                    </button>
                </header>

                <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
                    <label className={styles.label}>Gift Item Idea or Purchase: *
                        <input
                            className={styles.input}
                            type='text'
                            name='name'
                            required={true}
                            value={formData.name}
                            disabled={isSubmitting}
                            onChange={handleInputChange}
                        />
                    </label>

                    {/* Changing Status will change available fields: eventId (show/hide) & estimatedCost/purchasedCost. */}
                    <label className={styles.label}>Gift Status:
                        <select
                            name='status'
                            onChange={handleInputChange}
                            required={true}
                            value={formData.status}
                            disabled={isSubmitting}
                            className={styles.dropdownInput}
                        >
                            <option
                                value='idea'
                                className={styles.option}
                            >
                                Idea
                            </option>

                            <option
                                value='purchased'
                                className={styles.option}
                            >
                                Purchased
                            </option>
                        </select>
                    </label>

                    {/* Choose Event (Only if "status" === 'purchased') */}
                    {formData.status === 'purchased' && data.personId !== '' && (
                        <label className={styles.label}>Choose Event For Purchased Gift:
                            <select
                                name='eventId'
                                onChange={handleInputChange}
                                required={false}
                                disabled={isSubmitting}
                                className={styles.dropdownInput}
                            >
                                <option
                                    value=''
                                    className={styles.option}
                                >Choose Event</option>

                                {eventOptions.map(event => (
                                    <option
                                        key={event.id}
                                        value={event.id}
                                        className={styles.option}
                                    >{event.title}</option>
                                ))}
                            </select>
                        </label>
                    )}

                    {/* EstimatedCost or PurchasedCost (Changes depending on status === idea/purchased) */}
                    <label>
                        {formData.status === 'idea' && (<>Estimated Cost:</>)}
                        {formData.status === 'purchased' && (<>Purchased Cost:</>)}

                        <input
                            type='number'
                            name={formData.status === 'purchased' ? 'purchasedCost' : 'estimatedCost'} // 1 Input for both estimated & purchased cost
                            step='0.01' // for 'cents'
                            min='0'
                            placeholder='$0.00'
                            value={formData.status === 'purchased' ? 
                                (formData.purchasedCost ? formData.purchasedCost / 100 : '') :
                                (formData.estimatedCost ? formData.estimatedCost / 100 : '')
                            }
                            required={false}
                            disabled={isSubmitting}
                            onChange={handleCostChange}
                            className={styles.input}
                        />
                    </label>

                    {/* URL Validation happens in handleSubmit, NOT in change handler */}
                    <label className={styles.label}>URL:
                        <input
                            className={styles.input}
                            type='text'
                            name='url'
                            required={false}
                            value={formData.url}
                            disabled={isSubmitting}
                            onChange={handleInputChange}
                        />
                    </label>

                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Editing Gift Item...</>) : (<>Edit Gift Item</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}

// Note:  This is very basic and quite permissive
const validateURL = (url: string): string => {
    if (!url) { return '' }; // Guard, if falsey, return empty string

    try {
        const urlToTest = url.startsWith('http') ? url : `http://${url}`;
        new URL(urlToTest);
        return urlToTest
    } catch {
        return ''; // Invalid URL
    }
}