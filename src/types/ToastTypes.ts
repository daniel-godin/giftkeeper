// For ToastContext/Provider/Container
// Messages to the user

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    error?: Error;
    title?: string;
    message: string;
    duration?: number; // ms until auto-dismissal
}