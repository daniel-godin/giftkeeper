import { Link } from 'react-router'
import styles from './BottomNavigation.module.css'
import { CalendarFold, Gift, ListTodo, UsersRound } from 'lucide-react'

export function BottomNavigation () {

    return (
        <nav className={styles.bottomNav}>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link to='/people' className={styles.navLink}>
                        <span className={styles.icon}><UsersRound /></span>
                        <span className={styles.linkLabel}>People</span>
                    </Link>
                </li>

                <li className={styles.navItem}>
                    <Link to='/events' className={styles.navLink}>
                        <span className={styles.icon}><CalendarFold /></span>
                        <span className={styles.linkLabel}>Events</span>
                    </Link>
                </li>

                <li className={styles.navItem}>
                    <Link to='/gift-lists' className={styles.navLink}>
                        <span className={styles.icon}><Gift /></span>
                        <span className={styles.linkLabel}>Gift Lists</span>
                    </Link>
                </li>

                <li className={styles.navItem}>
                    <Link to='/wish-lists' className={styles.navLink}>
                        <span className={styles.icon}><ListTodo /></span>
                        <span className={styles.linkLabel}>Wish Lists</span>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}