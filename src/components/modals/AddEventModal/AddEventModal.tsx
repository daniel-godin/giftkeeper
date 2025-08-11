import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './AddEventModal.module.css'
import { Event } from '../../../types/EventType';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';
import { usePeople } from '../../../contexts/PeopleContext';
import { DEFAULT_EVENT } from '../../../constants/defaultObjects';
import { FormInput, FormPeopleSelector, FormSubmitButton, FormTextArea } from '../../ui';
import { useNavigate, useParams } from 'react-router';
import { getEventsCollRef } from '../../../firebase/firestore';
import { isValidEventDate } from '../../../utils';
import { useToast } from '../../../contexts/ToastContext';
import { devError } from '../../../utils/logger';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddEventModal({ isOpen, onClose } : AddEventModalProps) {
    const { authState } = useAuth();
    const { people } = usePeople();
    const navigate = useNavigate();
    const { personId } = useParams(); // For auto-filling on PersonPage
    const { addToast } = useToast();

    const [formData, setFormData] = useState<Event>(DEFAULT_EVENT);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            let initialFormData: Event = { ...DEFAULT_EVENT };

            if (personId) {
                const person = people.find(p => p.id === personId);
                if (person) {
                    initialFormData = {
                        ...initialFormData,
                        people: [personId]
                    }
                }
            }

            setFormData(initialFormData);
            setIsSubmitting(false);
            setShowOptionalFields(false);
        }
    }, [isOpen, personId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
        if (!formData.title.trim() || !formData.date || formData.people.length === 0) { // Form Validation Guard Clause
            addToast({
                type: 'warning',
                title: 'Missing Fields',
                message: 'Please fill out all required fields.'
            })
            return 
        }; 
        if (formData.date && !isValidEventDate(formData.date)) { // Event Date Validation Check
            addToast({
                type: 'warning',
                title: 'Invalid Date',
                message: 'Invalid date. Please try again.'
            })
            return;
        }

        setIsSubmitting(true);

        try {
            const newDocRef = doc(getEventsCollRef(authState.user.uid));
            const newDocumentData: Event = {
                ...DEFAULT_EVENT,
                ...formData,

                // Metadata
                id: newDocRef.id,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newDocumentData);

            addToast({
                type: 'success',
                title: 'Success!',
                message: 'Successfully added event. Redirecting you now.'
            })

            setTimeout(() => {
                onClose();
                resetModal();
                navigate(`/events/${newDocRef.id}`);
            }, 500);

        } catch (error) {
            devError('Error Adding New Event. Error:', error)
            addToast({
                type: 'error',
                title: 'Error Adding Event',
                message: 'Error adding event, please try again.',
                error: error as Error
            })
            setIsSubmitting(false);
        }
    }

    const resetModal = () => {
        setFormData(DEFAULT_EVENT);
        setIsSubmitting(false);
        setShowOptionalFields(false);
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.addEventModal}>
                <header className={styles.header}>
                    <h2>Add Event</h2>
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

                    {/* Event Date: */}
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
                    <FormPeopleSelector
                        legendText='Select People for this Event:'
                        people={people}
                        selectedPeopleIds={formData.people}
                        required={true}
                        disabled={isSubmitting}
                        onChange={handlePersonCheckboxChange}
                        allowCreateNewPerson={true}
                    />

                    {/* Show/Hide Optional Input Fields Toggle */}
                    {showOptionalFields ? (
                        <p className={styles.showOptionalFieldsText} onClick={() => setShowOptionalFields(false)}>
                            Hide Optional Fields
                        </p>
                    ) : (
                        <p className={styles.showOptionalFieldsText} onClick={() => setShowOptionalFields(true)}>
                            Show Optional Fields
                        </p>
                    )}

                    {/* Event Gift Budget (optional) */}
                    {showOptionalFields && (
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
                    )}

                    {/* Event Notes (optional) */}
                    {showOptionalFields && (
                        <FormTextArea
                            label='Notes:'
                            name='notes'
                            required={false}
                            disabled={isSubmitting}
                            value={formData.notes}
                            onChange={handleInputChange}
                        />
                    )}

                    <FormSubmitButton
                        text='Add New Event'
                        isSubmitting={isSubmitting}
                        submittingText='Adding New Event...'
                        disabled={!formData.title.trim() || !formData.date || formData.people.length === 0}
                    />

                </form>
            </div>
        </BaseModal>
    )
}