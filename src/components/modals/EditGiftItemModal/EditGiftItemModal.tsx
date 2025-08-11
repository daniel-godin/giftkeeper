import { useEffect, useMemo, useState } from 'react';
import { GiftItem, GiftStatus } from '../../../types/GiftType';
import styles from './EditGiftItemModal.module.css'
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { serverTimestamp, UpdateData, updateDoc } from 'firebase/firestore';
import { getGiftItemDocRef } from '../../../firebase/firestore';
import { useUpcomingEvents } from '../../../hooks/useUpcomingEvents';
import { Event } from '../../../types/EventType';
import { FormInput, FormSelect, FormSubmitButton } from '../../ui';
import { DEFAULT_GIFT_ITEM } from '../../../constants/defaultObjects';
import { sanitizeURL } from '../../../utils';
import { useToast } from '../../../contexts/ToastContext';
import { devError } from '../../../utils/logger';

interface EditGiftItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: GiftItem;
}

export function EditGiftItemModal({ isOpen, onClose, data } : EditGiftItemModalProps) {
    const { authState } = useAuth();
    const { addToast } = useToast();

    const [formData, setFormData] = useState<GiftItem>(DEFAULT_GIFT_ITEM);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Get upcoming events for selected "person" to display in dropdown.  Default is '' per defaultFormValues.
    // eventOptions makes sure to grab personId if dropdown changed to 'purchased' & personId is valid. Otherwise empty array of <Event>[].
    const upcomingEventsForPersonId = useUpcomingEvents(data.personId);
    const eventOptions: Event[] = formData.status === 'purchased' && data.personId ? upcomingEventsForPersonId : [];

    const transformedEventOptions = useMemo(() =>
        eventOptions.map(event => ({
            optionLabel: event.title,
            optionValue: event.id || ''
        })), [eventOptions]
    );

    useEffect(() => {
        if (isOpen) { 
            setFormData({
                ...DEFAULT_GIFT_ITEM,
                ...data
            }); 
        };
    }, [isOpen, data])

    // Default Input Change Handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    // Handle Status Change -- Special Changes Happen Depending On Status
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newStatus = e.target.value as GiftStatus;

        switch (newStatus) {
            case 'idea': // "Ideas" cannot be assigned an event.
                setFormData(prev => ({ ...prev, status: newStatus, 'eventId': '' }));
                break; 
            case 'purchased': 
                setFormData(prev => ({ ...prev, status: newStatus }));
                break;
            default: 
                console.warn('Unknown status:', newStatus);
        }
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
        if (!data || !data.id) { return }; // Guard Clause

        setIsSubmitting(true);

        try {
            const giftItemDocRef = getGiftItemDocRef(authState.user.uid, data.id);
            const giftItemDocumentData: UpdateData<GiftItem> = {
                name: formData.name,

                // Status & Associations
                status: formData.status,
                eventId: formData.eventId,
                url: sanitizeURL(formData.url || ''),

                // // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
                estimatedCost: formData.estimatedCost,
                purchasedCost: formData.purchasedCost,

                // Metadata
                updatedAt: serverTimestamp()
            }

            await updateDoc(giftItemDocRef, giftItemDocumentData);

            addToast({
                type: 'success',
                title: 'Success!',
                message: `Successfully updated ${formData.name}`
            })

            setTimeout(() => {
                onClose();
                resetModal();
            }, 500);

        } catch (error) {
            devError('Error Updating Gift Item. Error:', error);
            addToast({
                type: 'error',
                title: 'Error',
                message: `Error updating ${formData.name}`,
                error: error as Error
            })
            setIsSubmitting(false);
        }
    }

    // Resets All State In Modal
    const resetModal = () => {
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

                    {/* Gift Item Name/Title: */}
                    <FormInput
                        label='Gift Item Idea or Purchase:'
                        type='text'
                        name='name'
                        required={true}
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={handleInputChange}
                    />

                    {/* Changing Status will change available fields: eventId (show/hide) & estimatedCost/purchasedCost. */}
                    <FormSelect
                        label='Gift Status (idea/purchased):'
                        options={[
                            { optionLabel: 'Idea', optionValue: 'idea' },
                            { optionLabel: 'Purchased', optionValue: 'purchased' }
                        ]}
                        name='status'
                        required={true}
                        disabled={isSubmitting}
                        value={formData.status}
                        onChange={handleStatusChange}
                    />

                    {/* Choose Event (Only if "status" === 'purchased') */}
                    {formData.status === 'purchased' && data.personId !== '' && (
                        <FormSelect
                            label='Choose Event For Purchased Gift:'
                            options={transformedEventOptions}
                            name='eventId'
                            placeholder='Choose Event'
                            required={false}
                            disabled={isSubmitting}
                            value={formData.eventId}
                            onChange={handleInputChange}
                        />
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
                    <FormInput
                        label='URL:'
                        type='text'
                        name='url'
                        required={false}
                        disabled={isSubmitting}
                        value={formData.url}
                        onChange={handleInputChange}
                    />

                    <FormSubmitButton
                        text='Edit Gift Item'
                        isSubmitting={isSubmitting}
                        submittingText='Editing Gift Item...'
                        disabled={!formData.name.trim() || !formData.status}
                    />

                </form>
            </div>
        </BaseModal>
    )
}