import { useState } from 'react';
import styles from './QuickAddButton.module.css'
import { Plus } from 'lucide-react';
import { AddGiftItemModal } from '../../modals/AddGiftItemModal/AddGiftItemModal';

interface QuickAddButtonProps {
    className?: string;
    children?: React.ReactNode; // Allows custom content/text
}

export function QuickAddButton({ className, children } : QuickAddButtonProps) {
    const [isAddGiftItemModalOpen, setIsAddGiftItemModalOpen] = useState<boolean>(false);
    
    return (
        <>
            <button className={`${styles.quickAddButton} ${className || ''}`}
                onClick={() => setIsAddGiftItemModalOpen(true)}
            >
                <span className={styles.icon}>
                    {children || <Plus />}
                </span>
            </button>

            <AddGiftItemModal
                isOpen={isAddGiftItemModalOpen}
                onClose={() => setIsAddGiftItemModalOpen(false)}
            />
        </>
    )
}