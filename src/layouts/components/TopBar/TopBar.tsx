import { Link } from 'react-router';
import styles from './TopBar.module.css'
import { Circle } from 'lucide-react';

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
                    <nav className={styles.desktopNavigation}>
                        <ul className={styles.navList}>
                            <li className={styles.navItem}>Lists</li>
                            <li className={styles.navItem}>People</li>
                        </ul>
                    </nav>
                )}  
            </div>

            <div className={styles.profileIcon}>
                <Link to="/profile">
                    <Circle />
                </Link>
            </div>
        </header>
    )
}