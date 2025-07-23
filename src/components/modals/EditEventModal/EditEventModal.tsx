import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Event } from '../../../types/EventType';
import { BaseModal } from '../BaseModal/BaseModal'
import styles from './EditEventModal.module.css'
import { X } from 'lucide-react';
import { FormInput } from '../../ui';

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Event;
}

export function EditEventModal({ isOpen, onClose, data } : EditEventModalProps) {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Event>(data);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // FOR TESTING ONLY. TODO: DELETE THIS BEFORE PROD
    useEffect(() => {
        if (isOpen) {
            setFormData(data); // Seems to force/make sure data is loaded.  Probably race condition in EventPage is causing this mis-match.  Possibly just use DEFAULT_EVENT.
        }
        console.log('editEvent FormData:', formData);
    }, [isOpen])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.user) { return }; // Guard Clause

        setIsSubmitting(true);
        setStatus('Updating Event...');

        // try {
        //     const giftItemDocRef = getPersonGiftItemDocRef(authState.user.uid, data.personId, data.id);
        //     const giftItemDocumentData: UpdateData<GiftItem> = {
        //         name: formData.name,

        //         // Status & Associations
        //         status: formData.status,
        //         eventId: formData.eventId,
        //         url: validateURL(formData.url || ''),

        //         // // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
        //         estimatedCost: formData.estimatedCost,
        //         purchasedCost: formData.purchasedCost,

        //         // Metadata
        //         updatedAt: serverTimestamp()
        //     }

        //     updateDoc(giftItemDocRef, giftItemDocumentData);

        //     setTimeout(() => {
        //         onClose();
        //         resetModal();
        //     }, 500);

        // } catch (error) {
        //     console.error('Error Updating Gift Item. Error:', error);
        //     setStatus('Error Updating Gift Item. Try Again.');
        //     setIsSubmitting(false);
        // }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.editEventModal}>
                <header className={styles.header}>
                    <h2>Edit Event</h2>
                    <button type='button' className={styles.closeModalButton} onClick={() => { onClose() }}>
                        <X size={30} />
                    </button>
                </header>

                <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
                    {/* Event Title: */}
                    <FormInput
                        label='Event Title:'
                        type='text'
                        name='title'
                        required={true}
                        disabled={isSubmitting}
                        value={formData.title}
                        onChange={handleInputChange}
                    />

                    {/* Date: */}
                    <FormInput
                        label='Date of Event:'
                        type='date'
                        name='date'
                        required={true}
                        disabled={isSubmitting}
                        value={formData.date}
                        onChange={handleInputChange}
                    />

                    {/* People To Buy Gifts For At This Event */}



                    {/* Notes About Event */}



                    {/* Type of Event (Birthday, Holiday, Anniversary, etc.) */}



                    {/* Recurring Event?  Boolean */}

                    
                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Updating Event...</>) : (<>Update Event</>)}</button>

                </form>
            </div>
        </BaseModal>
    )
}