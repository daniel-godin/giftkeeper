import { createContext, useContext, useRef, useState } from "react";
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

const MAX_TOASTS = 3;

export function ToastProvider({ children } : { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const timeoutRefs = useRef<Map<string, NodeJS.Timeout>>(new Map());
    
    const addToast = ({
        type,
        title,
        message, 
        error, 
        duration = 5000
    } : Omit<Toast, 'id'>) => {

        const id = crypto.randomUUID();
        const newToast: Toast = { ...DEFAULT_TOAST, id, type, message, title, duration };

        setToasts(prev => {
            let updatedToasts = [...prev, newToast]

            // If number of toasts exceed maximum, remove oldest toast
            if (updatedToasts.length > MAX_TOASTS) {
                const toastsToRemove = updatedToasts.slice(0, 1);

                // Clean up timeouts for removed toasts
                toastsToRemove.forEach(toast => {
                    const timeoutId = timeoutRefs.current.get(toast.id);
                    if (timeoutId) {
                        clearTimeout(timeoutId);
                        timeoutRefs.current.delete(toast.id);
                    }
                })

                updatedToasts = updatedToasts.slice(-MAX_TOASTS);
            }

            return updatedToasts;
        });

        // Auto-dismiss
        if (duration > 0) {
            const timeoutId = setTimeout(() => {
                removeToast(id);
            }, duration);
        
            timeoutRefs.current.set(id, timeoutId);
        }

        // Log Errors in Sentry
        if (type === 'error' && error) {
            Sentry.captureException(error);
        }
    }

    const removeToast = (id: string) => {
        // Clear timeout if it exists
        const timeoutId = timeoutRefs.current.get(id);
        if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutRefs.current.delete(id);
        }

        setToasts(prev => prev.filter(toast => toast.id !== id));
    }

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    )
}