import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './EditPersonModal.module.css'
import { Person } from '../../../types/PersonType';
import { DEFAULT_PERSON } from '../../../constants/defaultObjects';
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';
import { FormInput, FormSubmitButton, FormTextArea } from '../../ui';
import { getPersonDocRef } from '../../../firebase/firestore';
import { serverTimestamp, UpdateData, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useBirthdayEventManager } from '../../../hooks/useBirthdayEventManager';

interface EditPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: Person;
}

export function EditPersonModal({ isOpen, onClose, data } : EditPersonModalProps) {
    const { authState } = useAuth();
    const { syncBirthdayEvent } = useBirthdayEventManager();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Person>(DEFAULT_PERSON);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Makes sure state is cleared and then populated with appropriate data.
    useEffect(() => {
        if (isOpen) {
            setStatus('');
            setFormData({
                ...DEFAULT_PERSON,
                ...data
            })
            setIsSubmitting(false);
        }
    }, [isOpen, data]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.user) { return }; // Guard Clause
        if (!data || !data.id) { return };

        // If birthdayChanged or nameChanged... means the birthday Event should be created or updated.
        const birthdayChanged = data.birthday !== formData.birthday;
        const nameChanged = data.name !== formData.name;

        setIsSubmitting(true);
        setStatus('Updating Person...');

        try {
            // Need writeBatch to sync person document & birthday event document.
            const batch = writeBatch(db);

            const docRef = getPersonDocRef(authState.user.uid, data.id);

            if ((birthdayChanged || nameChanged) && formData.birthday && formData.name) {
                await syncBirthdayEvent(data.id, formData.name, formData.birthday, batch)
            };

            // Use spread pattern to ensure all Person fields are included and prevent undefined issues
            const documentData: UpdateData<Person> = {
                ...DEFAULT_PERSON,  // Provides schema defaults
                ...formData,        // Overwrites with user input
                updatedAt: serverTimestamp()
            }

            batch.update(docRef, documentData);

            await batch.commit();

            setTimeout(() => {
                onClose();
                resetModal();
            }, 500);

        } catch (error) {
            console.error('Error Updating Person. Error:', error);
            setStatus('Error Updating Person. Try Again.');
            setIsSubmitting(false);
        }
    }

    // Resets All State In Modal
    const resetModal = () => {
        setStatus('');
        setFormData(DEFAULT_PERSON);
        setIsSubmitting(false);
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.editPersonModal}>
                <header className={styles.header}>
                    <h2>Edit Person</h2>
                    <button type='button' className={styles.closeModalButton} onClick={() => { onClose() }}>
                        <X size={30} />
                    </button>
                </header>

                <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>

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

                    {/* Person Nickname: */}
                    <FormInput
                        label='Nickname (eg. Mom):'
                        type='text'
                        name='nickname'
                        required={false}
                        disabled={isSubmitting}
                        value={formData.nickname}
                        onChange={handleInputChange}
                    />

                    {/* Birthdate: */}
                    <FormInput
                        label='Birthday:'
                        type='date'
                        name='birthday'
                        required={false}
                        disabled={isSubmitting}
                        value={formData.birthday}
                        onChange={handleInputChange}
                    />

                    {/* Relationship: */}
                    <FormInput
                        label='Relationship:'
                        type='text'
                        name='relationship'
                        required={false}
                        disabled={isSubmitting}
                        value={formData.relationship}
                        onChange={handleInputChange}
                    />

                    {/* Notes About Event */}
                    <FormTextArea
                        label='Notes:'
                        name='notes'
                        required={false}
                        disabled={isSubmitting}
                        value={formData.notes}
                        onChange={handleInputChange}
                    />

                    {/* Outputs Status Messages */}
                    <output>{status}</output>

                    <FormSubmitButton
                        text='Update Person'
                        isSubmitting={isSubmitting}
                        submittingText='Updating Person...'
                        disabled={!formData.name.trim()}
                    />
                </form>
            </div>
        </BaseModal>
    )
}