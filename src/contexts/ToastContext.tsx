import { createContext, useContext, useEffect, useState } from "react";
import { Toast } from "../types/ToastTypes";


interface ToastContextType {
    toasts: Toast[];
    addToast: (message: string, type: Toast['type'], title?: string, duration?: number) => void;
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

    useEffect(() => {
        console.log('toasts:', toasts);
    }, [toasts])
    

    const addToast = (message: string, type: Toast['type'], title?: string, duration = 5000) => {
        const id = crypto.randomUUID();
        const newToast: Toast = { id, type, message, title, duration };

        setToasts(prev => [...prev, newToast])

        // Auto-dismiss
        if (duration > 0) {
            setTimeout(() => {
                removeToast(id);
            }, duration)
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