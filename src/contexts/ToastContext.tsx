import { createContext, useContext, useState } from "react";
import { Toast } from "../types/ToastTypes";
import * as Sentry from '@sentry/react';
import { DEFAULT_TOAST } from "../constants/defaultObjects";

interface ToastContextType {
    toasts: Toast[];
    addToast: (params: Omit<Toast, 'id'>) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) { throw new Error('useToast must be used within a ToastProvider'); };
    return context;
}

export function ToastProvider({ children } : { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    
    const addToast = ({
        type,
        title,
        message, 
        error, 
        duration = 5000
    } : Omit<Toast, 'id'>) => {

        const id = crypto.randomUUID();
        const newToast: Toast = { ...DEFAULT_TOAST, id, type, message, title, duration };

        setToasts(prev => [...prev, newToast]);

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration)
        }

        // Log errors in Sentry
        if (type === 'error' && error) {
            Sentry.captureException(error);
        }
    }

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    )
}