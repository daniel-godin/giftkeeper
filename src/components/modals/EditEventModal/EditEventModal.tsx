import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Event } from '../../../types/EventType';
import { BaseModal } from '../BaseModal/BaseModal'
import styles from './EditEventModal.module.css'
import { X } from 'lucide-react';
import { FormCheckbox, FormInput } from '../../ui';
import { usePeople } from '../../../contexts/PeopleContext';
import { getEventDocRef } from '../../../firebase/firestore';
import { serverTimestamp, UpdateData, updateDoc } from 'firebase/firestore';
import { DEFAULT_EVENT } from '../../../constants/defaultObjects';

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Event;
}

export function EditEventModal({ isOpen, onClose, data } : EditEventModalProps) {
    const { authState } = useAuth();
    const { people } = usePeople();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Event>(DEFAULT_EVENT);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setStatus('');
            setFormData(data); // Make sure data is loaded into formData.
            setIsSubmitting(false);
        }
    }, [isOpen])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePersonCheckboxChange = (personId: string, checkedStatus: boolean) => {
        if (checkedStatus) {
            // Add personId to people array
            setFormData(prev => ({
                ...prev,
                people: [...prev.people, personId]
            }));
        } else {
            // Remove personId from people array
            setFormData(prev => ({
                ...prev,
                people: prev.people.filter(id => id !== personId)
            }))
        }
    }

    const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0; // Converts HTML Input Element From String to Number

        // Allow empty string for better UX
        if (value === '') { setFormData(prev => ({ ...prev, [name]: 0 })); return};

        // Prevent Negative Number, but still update
        const sanitizedValue = Math.max(0, numValue); // Returns larger between the two, so... if negative, returns 0.
        setFormData(prev => ({
            ...prev,
            [name]: Math.round(sanitizedValue * 100) // Convert to cents
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.user) { return }; // Guard Clause
        if (!data || !data.id) { return };

        setIsSubmitting(true);
        setStatus('Updating Event...');

        try {
            const eventDocRef = getEventDocRef(authState.user.uid, data.id);
            const eventDocumentData: UpdateData<Event> = {
                title: formData.title,
                people: formData.people,
                date: formData.date,
                // type: formData.type,
                // recurring: formData.recurring,
                budget: formData.budget,
                // notes: formData.notes,

                // Metadata
                updatedAt: serverTimestamp()
            }

            updateDoc(eventDocRef, eventDocumentData);

            console.log('Successfully updated event document');

            setTimeout(() => {
                onClose();
                resetModal();
            }, 500);

        } catch (error) {
            console.error('Error Updating Event. Error:', error);
            setStatus('Error Updating Event. Try Again.');
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
                    {/* Checklist + Create New Person */}
                    <fieldset className={styles.fieldset}>
                        <legend className={styles.legend}>People To Buy Gifts For:</legend>

                        {people.map(person => (
                            <FormCheckbox
                                key={person.id}
                                label={person.name}
                                name={person.id}
                                checked={formData.people.includes(person.id || '')}
                                onChange={(checked) => handlePersonCheckboxChange(person.id || '', checked)}
                            />
                        ))}
                    </fieldset>

                    {/* Event Gift Budget */}
                    <FormInput
                        label='Event Budget (total):'
                        type='number'
                        name='budget'
                        placeholder='$0.00'
                        min='0'
                        step='0.01'
                        required={false}
                        disabled={isSubmitting}
                        value={formData.budget ? formData.budget / 100 : ''}
                        onChange={handleBudgetChange}
                    />


                    {/* Notes About Event */}



                    {/* Type of Event (Birthday, Holiday, Anniversary, etc.) */}



                    {/* Recurring Event?  Boolean */}

                    
                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Updating Event...</>) : (<>Update Event</>)}</button>

                </form>
            </div>
        </BaseModal>
    )
}