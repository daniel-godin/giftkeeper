import { createPortal } from 'react-dom';
import { useToast } from '../../../contexts/ToastContext'
import styles from './ToastContainer.module.css'

interface ToastContainerProps {

}

export function ToastContainer() {
    const { toasts, addToast, removeToast } = useToast();

    return createPortal (
        <div className={styles.toastContainer}>
            {toasts.map(toast => (
                <div key={toast.id} className={styles.toast}>
                    <p>{toast.message}</p>
                </div>
            ))}
        </div>,
        document.getElementById('toast-root') || document.body
    )
}