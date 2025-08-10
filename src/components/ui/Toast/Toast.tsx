import { CheckSquare2, Info, TriangleAlert, X } from 'lucide-react';
import type { Toast as ToastType } from '../../../types/ToastTypes'
import styles from './Toast.module.css'
import { useState } from 'react';
import { useToast } from '../../../contexts/ToastContext';

interface ToastProps {
    toast: ToastType;
}

export function Toast({ toast } : ToastProps) {
    const { removeToast } = useToast();
    const [isClosing, setIsClosing] = useState(false);

    const handleClose = () => {
        setIsClosing(true);
        
        // Wait for slide-out animation to complete before removing from DOM
        setTimeout(() => {
            removeToast(toast.id);
        }, 300); // Match the slideOut animation duration
    };

    return (
        <aside
            className={`${styles.toast} ${toast.type ? styles[toast.type] : ''} ${isClosing ? styles.closing : ''}`}
        >
            {/* Loads a status "icon" depending on the Toast.Type */}
            <div className={styles.statusIcon}>
                {toast.type === 'success' && (<CheckSquare2 size={20} color='#10b981' />)}
                {toast.type === 'error' && (<X size={20} color='#ef4444' />)}
                {toast.type === 'warning' && (<TriangleAlert size={20} color='#f59e0b' />)}
                {toast.type === 'info' && (<Info size={20} color='#3b82f6' />)}
            </div>

            {/* Toast Title & Message */}
            <div className={styles.titleAndMessage}>
                <header className={styles.toastTitle}>{toast.title}</header>
                <p className={styles.toastMessage}>{toast.message}</p>
            </div>

            {/* Closes Toast Before Auto-Dismiss */}
            <button 
                type='button' 
                className={`unstyled-button ${styles.closeToastButton}`} 
                onClick={handleClose}
                disabled={isClosing}
            >
                <X size={18} />
            </button>
        </aside>
    )
}