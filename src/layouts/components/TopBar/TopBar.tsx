import { Link } from 'react-router';
import styles from './TopBar.module.css'
import { CalendarFold, Circle, UsersRound } from 'lucide-react';
import { QuickAddButton } from '../../../components/ui/QuickAddButton/QuickAddButton';
import { Logo } from '../../../components/ui/Logo/Logo';

interface TopBarProps {
    deviceType: 'mobile' | 'desktop';
} 

export function TopBar({ deviceType }: TopBarProps) {    

    return (
        <header className={styles.topBar}>
            <div className={styles.logo}>
                <Link to="/dashboard">
                    <Logo />
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
            
                            {/* Quick Add (+) Modal Button -- Same as BottomNavigation */}
                            <li className={styles.navItem}>
                                <QuickAddButton />
                            </li>

                            <li className={styles.navItem}>
                                <Link to='/events' className={styles.navLink}>
                                    <span className={styles.icon}><CalendarFold /></span>
                                    <span className={styles.linkLabel}>Events</span>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                )}  
            </div>

            <div className={styles.profileIcon}>
                <Link to="/profile" className={styles.navLink}>
                    <Circle size={35}/>
                </Link>
            </div>
        </header>
    )
}