import { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Event } from '../../../types/EventType';
import { BaseModal } from '../BaseModal/BaseModal'
import styles from './EditEventModal.module.css'

interface EditEventModalProps {
    isOpen: boolean;
    onClose: () => void;
    eventData: Event;
}

export function EditEventModal({ isOpen, onClose, eventData } : EditEventModalProps) {
    const { authState } = useAuth();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<Event>(eventData);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.editEventModal}>

            </div>
        </BaseModal>
    )
}