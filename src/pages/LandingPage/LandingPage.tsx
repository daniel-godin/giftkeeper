import { Link } from 'react-router'
import styles from './LandingPage.module.css'
import { Circle } from 'lucide-react'
import { AppMockup } from './components/AppMockup/AppMockup'

export function LandingPage () {
    return (
        <main className={styles.landingPage}>
            {/* Landing Page Nav Bar (Top of Screen) */}
            <nav className={styles.navBar}>
                <h1 className={styles.giftKeeperLogo}>GiftKeeper</h1>
                <Link className={styles.ctaButton} to={'/dashboard'}>Get Started</Link>
            </nav>


            {/* Header/Hero Section */}
            <section className={`${styles.section} ${styles.heroSection}`}>
                <header className={styles.sectionHeader}>
                    <h2>Stop Stressing About Gifts Forever</h2>
                    <p>Stop stressing about what to buy. Capture gift ideas the moment you hear them, track prices, set budgets, and always have the perfect present ready.</p>
                    <div className={styles.actionButtons}>
                        <Link className={styles.ctaButton} to={'/dashboard'}>Try Gift Keeper Free</Link>
                        <Link to={'/'}>Learn More</Link>
                    </div>
                    <Circle /><Circle /><Circle />
                    <p><strong>Join thoughtful gift-givers</strong> who never forget special moments</p>
                </header>

                {/* "AppMockup" Image */}
                <div className={styles.appMockup}>
                    <AppMockup />
                </div>
            </section>


            {/* "Features" Section */}
            <section className={`${styles.section} ${styles.featuresSection}`}>
                <header className={styles.featuresHeader}>
                    <h2>Turn Gift-Giving Into Something You Actually Enjoy</h2>
                    <p>Everything you need to capture ideas, stay on budget, and always have the perfect gift ready.</p>
                </header>

                {/* "Capture Ideas When They Happen" */}
                <div className={styles.featuresShowcase}>
                    <header className={styles.featuresShowcaseHeader}>
                        <h3>Capture Ideas When They Happen</h3>
                        <p>Someone mentions they need new headphones? Save it instantly. See a perfect gift while browsing? Add the link. Never forget another brilliant gift idea.</p>
                        <ul className={styles.featureList}>
                            <li className={styles.featureListItem}>Save gift ideas with photos and links</li>
                            <li className={styles.featureListItem}>Mark items as purchased or just ideas</li>
                            <li className={styles.featureListItem}>Track estimated vs actual costs</li>
                            <li className={styles.featureListItem}>Quick add from your phone</li>
                        </ul>
                    </header>

                    <div className={styles.featuresVisual}>

                    </div>
                </div>

                {/* "Never Blow Your Budget Again" */}
                <div className={styles.featuresShowcase}>
                    <header className={styles.featuresShowcaseHeader}>
                        <h3>Never Blow Your Budget Again</h3>
                        <p>Set a Christmas budget of $800? Track every gift idea and purchase. See exactly how much you have left for each person before you overspend.</p>
                        <ul className={styles.featureList}>
                            <li className={styles.featureListItem}>Set total budgets for holidays and birthdays</li>
                            <li className={styles.featureListItem}>See spending progress in real-time</li>
                            <li className={styles.featureListItem}>Track multiple people per event</li>
                            <li className={styles.featureListItem}>Get alerts before you go over budget</li>
                        </ul>
                    </header>

                    <div className={styles.featuresVisual}>

                    </div>
                </div>

                {/* "Keep Everyone's Details Handy" */}
                <div className={styles.featuresShowcase}>
                    <header className={styles.featuresShowcaseHeader}>
                        <h3>Keep Everyone's Details Handy</h3>
                        <p>Remember that Mike loves tech gadgets and his birthday is in July? Store these details so you always have context for your gift ideas.</p>
                        <ul className={styles.featureList}>
                            <li className={styles.featureListItem}>Birthday countdowns and reminders</li>
                            <li className={styles.featureListItem}>Notes about interests and preferences</li>
                            <li className={styles.featureListItem}>Relationship context for gift appropriateness</li>
                            <li className={styles.featureListItem}>See all their gift ideas in one place</li>
                        </ul>
                    </header>

                    <div className={styles.featuresVisual}>

                    </div>
                </div>

            </section>

            {/* "Footer" Call-to-Action Section */}
            <footer className={`${styles.cta}`}>
                <div className={styles.ctaBadge}>
                    ✨ Ready to transform gift-giving?
                </div>

                <header className={styles.ctaHeader}>
                    <h3>Never Run Out of Gift Ideas Again</h3>
                    <p>Join Gift Keeper today and turn gift-giving from a source of stress into something you actually enjoy.</p>
                    <div className={styles.ctaButtons}>
                        <Link className={styles.ctaButton} to={'/dashboard'}>Try Gift Keeper Free</Link>
                        <Link to={'/'}>See Features</Link>
                    </div>

                    <ul className={styles.trustIndicators}>
                        <li className={styles.trustIndicator}>Free to start</li>
                        <li className={styles.trustIndicator}>No credit card required</li>
                        <li className={styles.trustIndicator}>Setup in under 2 minutes</li>
                    </ul>
                </header>
            </footer>
        </main>
    )
}

