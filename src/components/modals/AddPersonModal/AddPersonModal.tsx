import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './AddPersonModal.module.css'
import { Person } from '../../../types/PersonType';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';

interface AddPersonalModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddPersonModal({ isOpen, onClose } : AddPersonalModalProps) {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Person>({ name: '', birthday: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '', birthday: '' })
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
            console.error('Cannot add new person without being logged in.');
            return;
        }

        if (!formData.name.trim()) {
            setStatus('Name is required');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setStatus('Adding New Person...');

        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'people'));

            const newPersonObject: Person = {
                id: newDocRef.id,
                name: formData.name,
                birthday: formData.birthday || '',

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newPersonObject);

            setStatus('New Person Added!! Closing in 2 seconds...');
            setFormData({ name: '' });

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error Adding New Person. Error:', error);
            setStatus('Error Adding New Person');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.addPersonModal}>
                <header className={styles.header}>
                    <h2>Add Person</h2>
                    <button type='button' className={styles.closeModalButton} onClick={() => { onClose() }}>
                        <X size={30} />
                    </button>
                </header>

                <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
                    <label className={styles.label}>Name:
                        <input
                            className={styles.input}
                            type='text'
                            name='name'
                            required={true}
                            value={formData.name}
                            onChange={handleTextInputChange}
                        />
                    </label>

                    <label className={styles.label}>Birthday:
                        <input
                            className={styles.input}
                            type='date'
                            name='birthday'
                            required={false}
                            value={formData.birthday}
                            onChange={handleDateInputChange}
                        />
                    </label>

                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Person</>) : (<>Add New Person</>)}</button>

                    
                </form>

            </div>
        </BaseModal>
    )
}