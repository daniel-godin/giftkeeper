import { createPortal } from 'react-dom';
import { useToast } from '../../../contexts/ToastContext'
import styles from './ToastContainer.module.css'
import { Toast } from './Toast';

export function ToastContainer() {
    const { toasts } = useToast();

    return createPortal (
        <div className={styles.toastContainer}>
            {toasts.map(toast => (
                <Toast key={toast.id} toast={toast} />
            ))}
        </div>,
        document.getElementById('toast-root') || document.body
    )
}