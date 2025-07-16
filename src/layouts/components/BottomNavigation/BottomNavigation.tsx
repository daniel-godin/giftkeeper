import { Link } from 'react-router'
import styles from './BottomNavigation.module.css'
import { CalendarFold, Gift, ListTodo, UsersRound } from 'lucide-react'
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

                <li className={styles.navItem}>
                    <Link to='/events' className={styles.navLink}>
                        <span className={styles.icon}><CalendarFold /></span>
                    </Link>
                </li>

                {/* Opens AddGiftItemModal */}
                <li className={styles.navItem}>
                    <QuickAddButton />
                </li>

                <li className={styles.navItem}>
                    <Link to='/gift-lists' className={styles.navLink}>
                        <span className={styles.icon}><Gift /></span>
                    </Link>
                </li>

                {/* // ARCHIVED: Wish Lists feature temporarily disabled
                // TODO: Re-enable after core gift tracking is polished */}
                {/* <li className={styles.navItem}>
                    <Link to='/wish-lists' className={styles.navLink}>
                        <span className={styles.icon}><ListTodo /></span>
                    </Link>
                </li> */}
            </ul>
        </nav>
    )
}