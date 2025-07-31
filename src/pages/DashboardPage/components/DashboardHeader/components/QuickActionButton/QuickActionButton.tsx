import styles from './QuickActionButton.module.css'

interface QuickActionButtonProps {
    icon: React.ReactNode;
    text: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary'; // Color filled in | empty background (match parent background color)
}

export function QuickActionButton({ icon, text, onClick, variant } : QuickActionButtonProps) {

    return (
        <button 
            className={`${styles.quickActionButton} ${variant === 'primary' ? styles.primary : ''}`}
            onClick={onClick}
        >
            <span className={styles.icon}>{icon}</span>
            <span className={styles.text}>{text}</span>
        </button>
    )
}