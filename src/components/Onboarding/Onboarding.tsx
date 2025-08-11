import { useState } from 'react';
import { Person } from '../../types/PersonType';
import styles from './Onboarding.module.css'
import { useAuth } from '../../contexts/AuthContext';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { getPeopleCollRef } from '../../firebase/firestore';
import { useBirthdayEventManager } from '../../hooks/useBirthdayEventManager';
import { DEFAULT_PERSON } from '../../constants/defaultObjects';
import { FormInput, FormSubmitButton } from '../ui';
import { isValidBirthday } from '../../utils';
import { useToast } from '../../contexts/ToastContext';
import { devError } from '../../utils/logger';

export function Onboarding() {
    const { authState } = useAuth();
    const { syncBirthdayEvent }= useBirthdayEventManager();
    const { addToast } = useToast();

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
            addToast({
                type: 'warning',
                title: 'Warning!',
                message: 'Fill in all required fields.'
            });
            return;
        };
        if (formData.birthday && !isValidBirthday(formData.birthday)) { // Birthday Date Validation
            addToast({
                type: 'warning',
                title: 'Warning!',
                message: 'Invalid birthday date.  Needs to be today or in the past.'
            });
            return; 
        }; 

        setIsSubmitting(true);

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
                await syncBirthdayEvent(personDocRef.id, formData.name, formData.birthday, batch)
            }

            await batch.commit();

            let toastMessage = `Successfully added ${personData.name}.`;
            if (formData.birthday) { toastMessage = `Successfully created ${personData.name} & created their birthday event!` };
            addToast({
                type: 'success',
                title: 'Success!',
                message: toastMessage
            });

            setIsSubmitting(false);
        } catch (error) {
            devError('Error Adding New Person. Error:', error)
            addToast({
                type: 'error',
                title: 'Error!',
                message: `Error adding new person.  Please try again.`,
                error: error as Error
            });

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