import { Link } from 'react-router'
import styles from './LandingPage.module.css'
import { AppMockup } from './components/AppMockup/AppMockup'
import { CheckCircle2 } from 'lucide-react'
import { Logo } from '../../components/ui/Logo/Logo'

export function LandingPage () {
    return (
        <main className={styles.landingPage}>
            {/* Landing Page Nav Bar (Top of Screen) */}
            <nav className={styles.navBar}>
                <Logo />
                <Link className={`unstyled-link ${styles.ctaButton}`} to={'/dashboard'}>Dashboard</Link>
            </nav>


            {/* Header/Hero Section */}
            <section className={`${styles.section} ${styles.heroSection}`}>
                <header className={styles.sectionHeader}>
                    <h2>Stop Stressing About <strong className={styles.purpleFade}>Gifts Forever</strong></h2>
                    <p className={styles.subHeaderText}>Stop stressing about what to buy. Capture gift ideas the moment you hear them, track prices, set budgets, and always have the perfect present ready.</p>
                    <div className={styles.actionButtons}>
                        <Link className={`unstyled-link ${styles.ctaButton}`} to={'/dashboard'}>Try Gift Keeper Free</Link>
                        <a className={`unstyled-link ${styles.secondaryCTAButton}`} href='#features'>Learn More</a>
                    </div>

                    <div className={styles.socialProof}>
                        <div className={styles.avatars}>
                            <div className={styles.avatar}>🎁</div>
                            <div className={styles.avatar}>🎂</div>
                            <div className={styles.avatar}>💝</div>
                        </div>
                        <div className={styles.socialProofText}>
                            <strong>Join thoughtful gift-givers</strong>
                            <p>who never forget special moments</p>
                        </div>
                    </div>
                </header>

                {/* "AppMockup" Image */}
                <div className={styles.appMockup}>
                    <AppMockup />
                </div>
            </section>


            {/* "Features" Section */}
            <section id='features' className={`${styles.section} ${styles.featuresSection}`}>
                <header className={styles.featuresHeader}>
                    <h2>Turn Gift-Giving Into Something You Actually Enjoy</h2>
                    <p className={styles.subHeaderText}>Everything you need to capture ideas, stay on budget, and always have the perfect gift ready.</p>
                </header>

                {/* "Capture Ideas When They Happen" */}
                <div className={styles.featuresShowcase}>
                    <header className={styles.featuresShowcaseHeader}>
                        <h3>Capture Ideas When They Happen</h3>
                        <p className={styles.subHeaderText}>Someone mentions they need new headphones? Save it instantly. See a perfect gift while browsing? Add the link. Never forget another brilliant gift idea.</p>
                        <ul className={styles.featureList}>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} /> Save gift ideas with photos and links</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} /> Mark items as purchased or just ideas</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} /> Track estimated vs actual costs</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} /> Quick add from your phone</li>
                        </ul>
                    </header>

                    <div className={styles.featuresVisual}>
                        <div className={`${styles.mockupCard} ${styles.mockupCardIdea}`}>
                            <strong>Wireless Headphones</strong> - Mike<br />
                            <small>💡 Idea • Est. $150 • "Mentioned wanting AirPods Pro"</small>
                        </div>
                        <div className={`${styles.mockupCard} ${styles.mockupCardPurchased}`}>
                            <strong>Yoga Mat</strong> - Sarah<br />
                            <small>✅ Purchased • $85 • For her birthday</small>
                        </div>
                        <div className={`${styles.mockupCard} ${styles.mockupCardPending}`}>
                            <strong>Garden Tools Set</strong> - Mom<br />
                            <small>💡 Idea • Est. $120 • "Saw her eyeing these at store"</small>
                        </div>
                    </div>
                </div>

                {/* "Never Blow Your Budget Again" */}
                <div className={styles.featuresShowcase}>
                    <header className={styles.featuresShowcaseHeader}>
                        <h3>Never Blow Your Budget Again</h3>
                        <p className={styles.subHeaderText}>Set a Christmas budget of $800? Track every gift idea and purchase. See exactly how much you have left for each person before you overspend.</p>
                        <ul className={styles.featureList}>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} />Set total budgets for holidays and birthdays</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} />See spending progress in real-time</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} />Track multiple people per event</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} />Get alerts before you go over budget</li>
                        </ul>
                    </header>

                    <div className={styles.featuresVisual}>
                        <div className={styles.budgetCard}>
                            <div className={styles.budgetCardHeader}>
                                <div>
                                    <strong>Christmas 2024</strong><br />
                                    <small>Budget: $800 • Spent: $320 • 4 people</small>
                                </div>
                                <div className={styles.budgetRemaining}>$480 left</div>
                            </div>
                            <div className={styles.progressBarContainer}>
                                <div className={styles.progressBarFill}></div>
                            </div>
                        </div>
                        <div className={styles.budgetCard}>
                            <div className={styles.budgetCardHeader}>
                                <div>
                                    <strong>Mom's Birthday</strong><br />
                                    <small>Budget: $150 • 3 gift ideas saved</small>
                                </div>
                                <div className={styles.budgetCountdown}>12 days</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* "Keep Everyone's Details Handy" */}
                <div className={styles.featuresShowcase}>
                    <header className={styles.featuresShowcaseHeader}>
                        <h3>Keep Everyone's Details Handy</h3>
                        <p className={styles.subHeaderText}>Remember that Mike loves tech gadgets and his birthday is in July? Store these details so you always have context for your gift ideas.</p>
                        <ul className={styles.featureList}>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} />Birthday countdowns and reminders</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} />Notes about interests and preferences</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} />Relationship context for gift appropriateness</li>
                            <li className={styles.featureListItem}><CheckCircle2 size={16} color={'green'} />See all their gift ideas in one place</li>
                        </ul>
                    </header>

                    <div className={styles.featuresVisual}>
                        <div className={`${styles.personCard} ${styles.personCardTech}`}>
                            <strong>Mike Johnson</strong> - Best Friend<br />
                            <small>Birthday: July 8 • Loves tech, cooking, board games</small>
                            <div className={styles.personCardFooter}>3 gift ideas saved • $285 total estimated</div>
                        </div>
                        <div className={`${styles.personCard} ${styles.personCardYoga}`}>
                            <strong>Sarah Chen</strong> - Sister<br />
                            <small>Birthday: March 15 • Loves yoga, coffee, reading</small>
                            <div className={styles.personCardFooter}>2 gift ideas saved • 1 purchased for birthday</div>
                        </div>
                        <div className={`${styles.personCard} ${styles.personCardGardening}`}>
                            <strong>Mom</strong> - Mother<br />
                            <small>Birthday: Dec 3 • Loves gardening, wine, art</small>
                            <div className={styles.personCardFooter}>4 gift ideas saved • Christmas & birthday</div>
                        </div>
                    </div>
                </div>

            </section>

            {/* "Footer" Call-to-Action Section */}
            <footer className={`${styles.cta}`}>
                <div className={styles.ctaBadge}>
                    ✨ Ready to transform gift-giving?
                </div>

                <header className={styles.ctaHeader}>
                    <h2>Never Run Out of Gift Ideas Again</h2>
                    <p className={styles.subHeaderText}>Join Gift Keeper today and turn gift-giving from a source of stress into something you actually enjoy.</p>
                    <div className={styles.actionButtons}>
                        <Link className={styles.ctaButton} to={'/dashboard'}>Try Gift Keeper Free</Link>
                        <a className={`unstyled-link ${styles.secondaryCTAButton}`} href='#features'>See Features</a>
                    </div>

                    <ul className={styles.trustIndicators}>
                        <li className={styles.trustIndicator}><CheckCircle2 size={14} color={'green'} />Free to start</li>
                        <li className={styles.trustIndicator}><CheckCircle2 size={14} color={'green'} />No credit card required</li>
                        <li className={styles.trustIndicator}><CheckCircle2 size={14} color={'green'} />Setup in under 2 minutes</li>
                    </ul>
                </header>
            </footer>
        </main>
    )
}

