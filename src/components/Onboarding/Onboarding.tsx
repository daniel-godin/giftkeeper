import { useState } from 'react';
import { Person } from '../../types/PersonType';
import styles from './Onboarding.module.css'
import { useAuth } from '../../contexts/AuthContext';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getPeopleCollRef } from '../../firebase/firestore';
import { useBirthdayEventManager } from '../../hooks/useBirthdayEventManager';
import { useNavigate } from 'react-router';
import { DEFAULT_PERSON } from '../../constants/defaultObjects';
import { FormInput, FormSubmitButton } from '../ui';
import { isValidBirthday } from '../../utils';

export function Onboarding() {
    const { authState } = useAuth();
    const { syncBirthdayEvent }= useBirthdayEventManager();
    const navigate = useNavigate();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Person>(DEFAULT_PERSON);
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

        if (!authState.user) { return }; // Auth Guard Clause
        if (!formData.name.trim()) { // Form Validation
            setStatus('Fill In All Required Fields');
            return;
        };
        if (formData.birthday && !isValidBirthday(formData.birthday)) { // Birthday Date Validation
            setStatus('Invalid Birthday Date. Needs to be today or in the past'); 
            return; 
        }; 

        setIsSubmitting(true);
        setStatus('Adding New Person...');

        try {
            const batch = writeBatch(db);
            const personDocRef = doc(getPeopleCollRef(authState.user.uid))

            const personData: Person = {
                ...DEFAULT_PERSON,
                ...formData,
                
                // Metadata
                id: personDocRef.id,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            batch.set(personDocRef, personData);

            if (formData.birthday) {
                setStatus('Adding Birthday Event To Database...')
                await syncBirthdayEvent(personDocRef.id, formData.name, formData.birthday, batch)
            }

            await batch.commit();

            setTimeout(() => {
                navigate(`/people/${personDocRef.id}`)
            }, 150);

        } catch (error) {
            console.error('Error Adding New Person. Error:', error);
            setStatus('Error Adding New Person');
            setIsSubmitting(false);
        }
    }

    return (
        <section className={styles.onboardingContainer}>
            <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
                <header className={styles.header}>Add Your First Person</header>

                {/* Person Name: */}
                <FormInput
                    label='Name:'
                    type='text'
                    name='name'
                    required={true}
                    disabled={isSubmitting}
                    value={formData.name}
                    onChange={handleInputChange}
                />

                {/* Birthday: (optional, but encouraged) */}
                <FormInput
                    label='Birthday:'
                    type='date'
                    name='birthday'
                    required={false}
                    disabled={isSubmitting}
                    value={formData.birthday}
                    onChange={handleInputChange}
                />

                <output>
                    {status}
                </output>
        
                <FormSubmitButton
                    text='Add Your First Person'
                    isSubmitting={isSubmitting}
                    submittingText='Adding Person...'
                    disabled={!formData.name.trim()}
                />
            </form>
        </section>
    )
}