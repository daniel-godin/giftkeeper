import styles from './AddWishListModal.module.css'
import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';
import { WishList } from '../../../types/WishListType';

interface AddWishListModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddWishListModal({ isOpen, onClose } : AddWishListModalProps) {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<WishList>({ title: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
            console.error('Cannot add new wish list without being logged in.');
            return;
        }

        if (!formData.title.trim()) {
            setStatus('Title is required');
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        setStatus('Adding New Wish List...');

        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'wishLists'));

            const newDocumentData: WishList = {
                id: newDocRef.id,
                title: formData.title,

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newDocumentData);

            setStatus('New Wish List Added!! Closing in 2 seconds...');
            setFormData({ title: '' });

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error Adding New Wish List. Error:', error);
            setStatus('Error Adding New Wish List');
        } finally {
            setIsSubmitting(false);
        }
    }

    useEffect(() => {
        if (isOpen) {
            setFormData({ title: '' })
            setStatus('');
        }
    }, [isOpen]);

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.addWishListModal}>
                <header className={styles.header}>
                    <h2>Add Wish List</h2>
                    <button type='button' className={styles.closeModalButton} onClick={() => { onClose() }}>
                        <X size={30} />
                    </button>
                </header>

                <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
                    <label className={styles.label}>Wish List Title:
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

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Wish List...</>) : (<>Add New Wish List</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}