import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './AddEventModal.module.css'
import { Event } from '../../../types/EventType';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';

interface AddEventModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddEventModal({ isOpen, onClose } : AddEventModalProps) {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Event>({ title: '', date: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({ title: '', date: '' })
            setStatus('');
        }
    }, [isOpen])

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    // For now, handleTextInputChange works the same as handleDateInputChange.  Later will use a custom Date object most likely.  For now it's just a now ISO string "yyyy-mm-dd".
    const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
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

        setIsSubmitting(true);
        setStatus('Adding New Event...');

        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'events'));

            const newEventObject: Event = {
                id: newDocRef.id,
                title: formData.title,
                date: formData.date || '',

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newEventObject);

            setStatus('New Event Added!! Closing in 2 seconds...');
            setFormData({ title: '', date: '' });

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error Adding New Event. Error:', error);
            setStatus('Error Adding New Event');
        } finally {
            setIsSubmitting(false);
        }
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
                    <label className={styles.label}>Event Title:
                        <input
                            className={styles.input}
                            type='text'
                            name='title'
                            required={true}
                            value={formData.title}
                            onChange={handleTextInputChange}
                        />
                    </label>

                    <label className={styles.label}>Event Date:
                        <input
                            className={styles.input}
                            type='date'
                            name='date'
                            required={false}
                            value={formData.date}
                            onChange={handleDateInputChange}
                        />
                    </label>

                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Event...</>) : (<>Add New Event</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}