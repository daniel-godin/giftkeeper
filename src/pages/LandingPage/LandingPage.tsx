import { Link } from 'react-router'
import styles from './LandingPage.module.css'

export function LandingPage () {
    return (
        <div className={styles.landingPageContainer}>
            <div className={styles.tempLandingPageWelcomeContainer}>
                <p>Welcome to Gift Keeper.</p>
                <p>This page is under construction.  Please check back later.</p>
            
                <Link to='/auth'>Authentication Page</Link>
            </div>

            <Link to='/dashboard' className={styles.dashboardLink}>Dashboard</Link>
        </div>
    )
}