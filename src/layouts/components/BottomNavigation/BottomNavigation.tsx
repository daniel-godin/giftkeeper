import { Link } from 'react-router'
import styles from './BottomNavigation.module.css'
import { CalendarFold, UsersRound } from 'lucide-react'
import { QuickAddButton } from '../../../components/ui/QuickAddButton/QuickAddButton';

export function BottomNavigation () {

    return (
        <nav className={styles.bottomNav}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to='/people' className={styles.navLink}>
                        <span className={styles.icon}><UsersRound /></span>
                    </Link>
                </li>

                {/* Opens AddGiftItemModal */}
                <li className={styles.navItem}>
                    <QuickAddButton />
                </li>

                <li className={styles.navItem}>
                    <Link to='/events' className={styles.navLink}>
                        <span className={styles.icon}><CalendarFold /></span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}