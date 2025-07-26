import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './AddEventModal.module.css'
import { Event } from '../../../types/EventType';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';
import { usePeople } from '../../../contexts/PeopleContext';
import { DEFAULT_EVENT } from '../../../constants/defaultObjects';
import { FormInput, FormPeopleSelector } from '../../ui';
import { useNavigate } from 'react-router';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddEventModal({ isOpen, onClose } : AddEventModalProps) {
    const { authState } = useAuth();
    const { people } = usePeople();
    const navigate = useNavigate();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Event>(DEFAULT_EVENT);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            resetModal(); // Resets to default empty modal.
        }
    }, [isOpen]);

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guard Clauses:
        if (!authState.user) { 
            console.error('Cannot add new event without being logged in.');
            return;
        }

        if (!formData.title.trim()) {
            setStatus('Title is required');
            setIsSubmitting(false);
            return;
        }

        if (formData.people.length === 0) {
            setStatus('Please select at least one person');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setStatus('Adding New Event...');

        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'events'));

            const newEventObject: Event = {
                id: newDocRef.id,
                title: formData.title,
                date: formData.date || '',
                people: formData.people,

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newEventObject);

            setStatus('New Event Added!!');

            setTimeout(() => {
                // onClose(); // Do I even need the onClose since I'm navigating away?  This should de-mount the component.
                resetModal();
                navigate(`/events/${newDocRef.id}`);
            }, 500);

        } catch (error) {
            console.error('Error Adding New Event. Error:', error);
            setStatus('Error Adding New Event');
        } finally {
            setIsSubmitting(false);
        }
    }

    const resetModal = () => {
        setStatus('');
        setFormData(DEFAULT_EVENT);
        setIsSubmitting(false);
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
                        disabled={isSubmitting}
                        onChange={handlePersonCheckboxChange}
                        allowCreateNewPerson={true}
                    />

                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Event...</>) : (<>Add New Event</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}