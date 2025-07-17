import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './AddGiftListModal.module.css'
import { GiftList } from '../../../types/GiftType';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';

interface AddGiftListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddGiftListModal({ isOpen, onClose } : AddGiftListModalProps) {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<GiftList>({ title: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({ title: '' })
            setStatus('');
        }
    }, [isOpen]);

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
            console.error('Cannot add new gift list without being logged in.');
            return;
        }

        if (!formData.title.trim()) {
            setStatus('Title is required');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setStatus('Adding New Gift List...');

        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'giftLists'));

            const newDocumentData: GiftList = {
                id: newDocRef.id,
                title: formData.title,

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newDocumentData);

            setStatus('New Gift List Added!! Closing in 2 seconds...');
            setFormData({ title: '' });

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error Adding New Gift List. Error:', error);
            setStatus('Error Adding New Gift List');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.addGiftListModal}>
                <header className={styles.header}>
                    <h2>Add Gift List</h2>
                    <button type='button' className={styles.closeModalButton} onClick={() => { onClose() }}>
                        <X size={30} />
                    </button>
                </header>

                <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
                    <label className={styles.label}>Gift List Title:
                        <input
                            className={styles.input}
                            type='text'
                            name='title'
                            required={true}
                            value={formData.title}
                            onChange={handleTextInputChange}
                        />
                    </label>

                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Gift List...</>) : (<>Add New Gift List</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}