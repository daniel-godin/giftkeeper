import { useState } from 'react';
import { Person } from '../../types/PersonType';
import styles from './Onboarding.module.css'
import { useAuth } from '../../contexts/AuthContext';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getGiftListsCollRef, getPeopleCollRef } from '../../firebase/firestore';
import { useBirthdayEventManager } from '../../hooks/useBirthdayEventManager';
import { GiftList } from '../../types/GiftListType';
import { useNavigate } from 'react-router';

export function Onboarding() {

    return (
        <section className={styles.onboardingContainer}>
            {/* Possibly conditional logic to add more items to Onboarding */}
            <OnboardingPersonForm />
        </section>
    )
}

function OnboardingPersonForm() {
    const { authState } = useAuth();
    const { syncBirthdayEvent }= useBirthdayEventManager();
    const navigate = useNavigate();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Person>({ name: '', birthday: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
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

            if (formData.birthday) {
                await syncBirthdayEvent(personRef.id, formData.name, formData.birthday, batch)
            }

            await batch.commit();

            navigate(`/people/${personRef.id}`)

            // setStatus('✅ Person added successfully!');
            // setTimeout(() => {
                
            // }, 1000);
        } catch (error) {
            console.error('Error Adding New Person. Error:', error);
            setStatus('Error Adding New Person');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
            <header className={styles.header}>Add Your First Person</header>
            <label className={styles.label}>Name: *
                <input
                    className={styles.input}
                    type='text'
                    name='name'
                    required={true}
                    value={formData.name}
                    disabled={isSubmitting}
                    onChange={handleInputChange}
                />
            </label>

            <label className={styles.label}>Birthdate (optional):
                <input
                    className={styles.input}
                    type='date'
                    name='birthday'
                    required={false}
                    value={formData.birthday}
                    disabled={isSubmitting}
                    onChange={handleInputChange}
                />
            </label>

            <button className={styles.button} type='submit'>Add Your First Person</button>

            {status && ( status )}
        </form>
    )
}