import { ChartNoAxesColumn, Gift, Target, Users } from 'lucide-react'
import styles from './NavPanel.module.css'
import { Link } from 'react-router'

export function NavPanel () {
    return (
        <nav className={styles.navPanel}>
            <div className={styles.logoContainer}>
                <Gift size={40} />
                <header>Gift Keeper</header>
            </div>

            <div className={styles.mainNavSection}>
                <header className={styles.navHeader}>
                    Main
                </header>
                <div className={styles.linksSection}>
                    <div className={styles.linkContainer}>
                        <ChartNoAxesColumn size={30} />
                        <Link to='/dashboard'>Dashboard</Link>
                    </div>
                    <div className={styles.linkContainer}>
                        <Gift size={30} />
                        <Link to='/dashboard'>My Wish Lists</Link>
                    </div>
                    <div className={styles.linkContainer}>
                        <Target size={30} />
                        <Link to='/dashboard'>Gift Lists</Link>
                    </div>
                    <div className={styles.linkContainer}>
                        <Users size={30} />
                        <Link to='/dashboard'>Shared With Me</Link>
                    </div>
                </div>
            </div>

            <div className={styles.managementNavSection}>

            </div>

            <div className={styles.accountNavSection}>

            </div>

            <div className={styles.bottomOfNavSection}>

            </div>
            
        </nav>
    )
}