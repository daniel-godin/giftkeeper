import { Link } from 'react-router'
import styles from './BottomNavigation.module.css'
import { CalendarFold, Gift, ListTodo, Plus, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { AddGiftItemModal } from '../../../components/modals/AddGiftItemModal/AddGiftItemModal';

export function BottomNavigation () {
    const [isAddGiftItemModalOpen, setIsAddGiftItemModalOpen] = useState<boolean>(false);

    return (
        <nav className={styles.bottomNav}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to='/people' className={styles.navLink}>
                        <span className={styles.icon}><UsersRound /></span>
                    </Link>
                </li>

                <li className={styles.navItem}>
                    <Link to='/events' className={styles.navLink}>
                        <span className={styles.icon}><CalendarFold /></span>
                    </Link>
                </li>

                <li className={styles.navItem}>
                    <button className={`${styles.navLink} ${styles.openModalButton}`}
                        onClick={() => setIsAddGiftItemModalOpen(true)}
                    >
                        <span className={styles.icon}><Plus /></span>
                    </button>
                </li>

                <li className={styles.navItem}>
                    <Link to='/gift-lists' className={styles.navLink}>
                        <span className={styles.icon}><Gift /></span>
                    </Link>
                </li>

                <li className={styles.navItem}>
                    <Link to='/wish-lists' className={styles.navLink}>
                        <span className={styles.icon}><ListTodo /></span>
                    </Link>
                </li>
            </ul>

            <AddGiftItemModal
                isOpen={isAddGiftItemModalOpen}
                onClose={() => setIsAddGiftItemModalOpen(false)}
            />
        </nav>
    )
}