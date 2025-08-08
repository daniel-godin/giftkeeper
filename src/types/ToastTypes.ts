// For ToastContext/Provider/Container
// Messages to the user

export interface Toast {
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    title?: string;
    message: string;
    duration?: number; // ms until auto-dismissal
}