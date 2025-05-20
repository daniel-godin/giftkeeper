import { useCallback, useEffect } from 'react';
import styles from './BaseModal.module.css'
import { createPortal } from 'react-dom';

interface BaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
}

export function BaseModal({ isOpen, onClose, children } : BaseModalProps) {
    // Handle Escape From Modal
    const handleEscapeKey = useCallback((event: KeyboardEvent) => {
        if (event.key === "Escape") {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'hidden';
        }
        
        return () => {
            document.removeEventListener('keydown', handleEscapeKey);
            document.body.style.overflow = 'unset';
        }
    }, [isOpen, handleEscapeKey]);

    // If "isOpen" is false, modal should NOT open/render.
    if (!isOpen) { return null; };

    return createPortal(
        <div className={styles.baseModalOverlay} onClick={onClose} aria-hidden="true">
            <div className={styles.baseModal} aria-modal='true' role='dialog' onClick={e => e.stopPropagation()}>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root') || document.body
    ) 
}