import { useState } from 'react';
import { useAuth } from '../../../../contexts/AuthContext';
import styles from './OnboardingForm.module.css'
import { Person } from '../../../../types/PersonType';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getPeopleCollection } from '../../../../firebase/firestore';

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
            const newDocRef = doc(getPeopleCollection(authState.user.uid))

            const newDataObject: Person = {
                id: newDocRef.id,
                name: formData.name,
                birthday: formData.birthday || '',

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newDataObject);

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