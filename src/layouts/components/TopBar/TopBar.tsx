import { Link } from 'react-router';
import styles from './TopBar.module.css'
import { CalendarFold, Circle, Gift, ListTodo, UsersRound } from 'lucide-react';

interface TopBarProps {
    deviceType: 'mobile' | 'desktop';
} 

export function TopBar({ deviceType }: TopBarProps) {

    return (
        <header className={styles.topBar}>
            <div className={styles.logo}>
                <Link to="/dashboard">
                    GiftKeeper
                </Link>
            </div>

            <div className={styles.middleContainer}>
                {/* Navigation -- Desktop Only */}
                {deviceType === 'desktop' && (
                    <nav className={styles.topNav}>
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
                )}  
            </div>

            <div className={styles.profileIcon}>
                <Link to="/profile">
                    <Circle size={35}/>
                </Link>
            </div>
        </header>
    )
}