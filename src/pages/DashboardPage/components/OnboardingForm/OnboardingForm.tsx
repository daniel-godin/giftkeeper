import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from './OnboardingForm.module.css'
import { Person } from '../../../../types/PersonType';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { getGiftListsCollRef, getPeopleCollRef } from '../../../../firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { GiftList } from '../../../../types/GiftListType';

export function OnboardingForm () {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Person>({ name: '' });
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
            console.error('Cannot add new person without being logged in.');
            setIsSubmitting(false);
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
            const batch = writeBatch(db);

            const personRef = doc(getPeopleCollRef(authState.user.uid))
            const giftListRef = doc(getGiftListsCollRef(authState.user.uid))

            const personData: Person = {
                id: personRef.id,
                name: formData.name,

                birthday: formData.birthday || '',

                giftListId: giftListRef.id,

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            const giftListData: GiftList = {
                id: giftListRef.id,
                title: `${formData.name}'s Gift List`,

                personId: personRef.id,

                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            batch.set(personRef, personData);
            batch.set(giftListRef, giftListData);

            await batch.commit();

            setStatus('✅ Person added successfully!');
            setTimeout(() => {
                // The PeopleContext will automatically update and flip the view
                setStatus('');
                setFormData({ name: '' })
            }, 2000);
        } catch (error) {
            console.error('Error Adding New Person. Error:', error);
            setStatus('Error Adding New Person');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
            <h3>Let's start by adding the people you buy gifts for.</h3>
            <label className={styles.label}>Name:
                <input
                    className={styles.input}
                    type='text'
                    name='name'
                    required={true}
                    value={formData.name}
                    disabled={isSubmitting}
                    onChange={handleTextInputChange}
                />
            </label>
            <button className={styles.button} type='submit'>Add Your First Person</button>
            {status && ( status )}
        </form>
    )
}