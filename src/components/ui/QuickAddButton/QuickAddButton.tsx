import { useState } from 'react';
import styles from './QuickAddButton.module.css'
import { Plus } from 'lucide-react';
import { AddGiftItemModal } from '../../modals/AddGiftItemModal/AddGiftItemModal';

export function QuickAddButton() {
    const [isAddGiftItemModalOpen, setIsAddGiftItemModalOpen] = useState<boolean>(false);
    
    return (
        <>
            <button className={styles.quickAddButton}
                onClick={() => setIsAddGiftItemModalOpen(true)}
            >
                <span className={styles.icon}><Plus /></span>
            </button>

            <AddGiftItemModal
                isOpen={isAddGiftItemModalOpen}
                onClose={() => setIsAddGiftItemModalOpen(false)}
            />
        </>
    )
}