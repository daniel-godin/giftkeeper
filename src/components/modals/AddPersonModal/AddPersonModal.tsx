import { useEffect, useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import styles from './AddPersonModal.module.css'
import { Person } from '../../../types/PersonType';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { BaseModal } from '../BaseModal/BaseModal';
import { X } from 'lucide-react';
import { getPeopleCollRef } from '../../../firebase/firestore';
import { useBirthdayEventManager } from '../../../hooks/useBirthdayEventManager';
import { DEFAULT_PERSON } from '../../../constants/defaultObjects';
import { FormInput, FormTextArea } from '../../ui';
import { useNavigate } from 'react-router';

interface AddPersonModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddPersonModal({ isOpen, onClose } : AddPersonModalProps) {
    const { authState } = useAuth();
    const { syncBirthdayEvent } = useBirthdayEventManager();
    const navigate = useNavigate();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Person>(DEFAULT_PERSON);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) { resetModal(); } // onOpen... Reset Modal To Empty State
    }, [isOpen])

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
        if (!formData.name.trim()) { return }; // Form Validation / Guard Clause

        setIsSubmitting(true);
        setStatus('Adding New Person...');

        try {
            const batch = writeBatch(db);
            const newDocRef = doc(getPeopleCollRef(authState.user.uid));
            const newDocData: Person = {
                ...DEFAULT_PERSON,
                ...formData,

                // Metadata
                id: newDocRef.id,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            batch.set(newDocRef, newDocData);

            // If birthday has been added.  Create an event of type "birthday" for person.
            if (formData.birthday) {
                setStatus('Creating Birthday Event...');
                await syncBirthdayEvent(newDocRef.id, formData.name, formData.birthday, batch)
            }

            await batch.commit();

            setStatus('New Person Added!!');

            setTimeout(() => {
                onClose();
                resetModal();
                navigate(`/people/${newDocRef.id}`)
            }, 500);

        } catch (error) {
            console.error('Error Adding New Person. Error:', error);
            setStatus('Error Adding New Person');
            setIsSubmitting(false);
        }
    }

    const resetModal = () => {
        setStatus('');
        setFormData(DEFAULT_PERSON);
        setIsSubmitting(false);
        setShowOptionalFields(false);
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

                    {/* Show/Hide Optional Input Fields Toggle */}
                    {showOptionalFields ? (
                        <p className={styles.showOptionalFieldsText} onClick={() => setShowOptionalFields(false)}>
                            Hide Optional Fields
                        </p>
                    ) : (
                        <p className={styles.showOptionalFieldsText} onClick={() => setShowOptionalFields(true)}>
                            Show Optional Fields
                        </p>
                    )}

                    {/* Relationship (optional) */}
                    {showOptionalFields && (
                        <FormInput
                            label='Relationship:'
                            type='text'
                            name='relationship'
                            required={false}
                            disabled={isSubmitting}
                            value={formData.relationship}
                            onChange={handleInputChange}
                        />
                    )}

                    {/* Person Notes (optional) */}
                    {showOptionalFields && (
                        <FormTextArea
                            label='Notes:'
                            name='notes'
                            required={false}
                            disabled={isSubmitting}
                            value={formData.notes}
                            onChange={handleInputChange}
                        />
                    )}

                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Person</>) : (<>Add New Person</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}