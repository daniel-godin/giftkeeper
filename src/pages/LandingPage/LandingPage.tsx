import { Link } from 'react-router'
import styles from './LandingPage.module.css'

export function LandingPage () {
    return (
        <main className={styles.landingPage}>
            {/* Landing Page Nav Bar (Top of Screen) */}
            <nav className={styles.navBar}>
                <h1 className={styles.giftKeeperLogo}>GiftKeeper</h1>
                <Link to={'/dashboard'}>Get Started</Link>
            </nav>


            {/* Header/Hero Section */}
            <section className={styles.heroSection}>
                <header className={styles.sectionHeader}>
                    <h2>Stop Stressing About Gifts Forever</h2>
                    <p>Stop stressing about what to buy. Capture gift ideas the moment you hear them, track prices, set budgets, and always have the perfect present ready.</p>
                </header>
            </section>


            {/* "Features" Section */}




            {/* "Footer" Call-to-Action Section */}

            {/* <div className={styles.tempLandingPageWelcomeContainer}>
                <p>Welcome to Gift Keeper.</p>
                <p>This page is under construction.  Please check back later.</p>
            
                <Link to='/auth'>Authentication Page</Link>
            </div>

            <Link to='/dashboard' className={styles.dashboardLink}>Dashboard</Link> */}
        </main>
    )
}