import styles from './AddGiftItemModal.module.css';
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { GiftItem } from "../../../types/GiftListType";
import { BaseModal } from "../BaseModal/BaseModal";
import { X } from 'lucide-react';
import { getGiftItemsCollRef } from '../../../firebase/firestore';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { usePeople } from '../../../contexts/PeopleContext';


interface AddGiftItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddGiftItemModal({ isOpen, onClose } : AddGiftItemModalProps) {
    const { authState } = useAuth();
    const { people } = usePeople();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<GiftItem>({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setFormData({ name: '' })
            setStatus('');

            // FOR TESTING:
            console.log('people:', people);
        }
    }, [isOpen]);

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleDropdownInputChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;

        console.log('name:', name, 'value:', value);
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.user) { return }; // Guard Clause
        if (!formData.name.trim()) { return }; // Form Validation Guard Clause

        setIsSubmitting(true);
        setStatus('Adding New Gift Item...');

        try {
            const newDocRef = doc(getGiftItemsCollRef(authState.user.uid, 'TODO-FIX-THIS-LATER-TO-DYNAMIC'));

            const newDocumentData: GiftItem = {
                id: newDocRef.id,
                name: formData.name,

                // Denormalized Data
                // personId: string; // For connecting to Person
                // personName?: string; // For displaying in UI, reduces unneeded lookups to find name in Person.

                // // Status & Associations
                // giftListId?: string; // Gift List ID that this Item belongs to.
                // status?: 'idea' | 'purchased'; // idea is default.
                // eventId?: string; // eventId that item has been 'purchased' for.

                // // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
                // estimatedCost?: number;
                // purchasedCost?: number;

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newDocumentData);

            setStatus('New Gift List Added!! Closing in 2 seconds...');
            setFormData({ name: '' });

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
            <div className={styles.addGiftItemModal}>
                <header className={styles.header}>
                    <h2>Add Gift Item</h2>
                    <button type='button' className={styles.closeModalButton} onClick={() => { onClose() }}>
                        <X size={30} />
                    </button>
                </header>

                <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
                    <label className={styles.label}>Gift Item:
                        <input
                            className={styles.input}
                            type='text'
                            name='name'
                            required={true}
                            value={formData.name}
                            onChange={handleTextInputChange}
                        />
                    </label>

                    <select
                        name='person'
                        onChange={handleDropdownInputChange}
                        className={styles.dropdown}
                    >
                        <option
                            value=''
                            className={styles.option}
                        >Choose Person</option>

                        {people.map(person => (
                            <option
                                key={person.id}
                                value={person.id}
                                className={styles.option}
                            >{person.name}</option>
                        ))}
                    </select>

                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Gift Item...</>) : (<>Add New Gift Item</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}