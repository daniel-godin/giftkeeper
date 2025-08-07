import { useState } from 'react';
import styles from './AuthPage.module.css'
import { SignInForm } from './components/SignInForm/SignInForm';
import { SignUpForm } from './components/SignUpForm/SignUpForm';
import { PasswordResetForm } from './components/PasswordResetForm/PasswordResetForm';
import { Logo } from '../../components/ui/Logo/Logo';
import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router';

export type AuthMode = 'signin' | 'signup' | 'password_reset';

export function AuthPage () {
    const [authMode, setAuthMode] = useState<AuthMode>('signin');

    return (
        <div className={styles.authPage}>
            <div className={styles.authBoxContainer}>
                <header className={styles.authHeader}>
                    <Link className={`unstyled-link`} to={'/'}>
                        <Logo />
                    </Link>
                    <p className={styles.subHeaderText}>Never forget the perfect gift again</p>
                </header>

                <div className={styles.formContainer}>
                    {authMode === 'signin' && (
                        <>
                            <SignInForm />
                            <button className={`unstyled-button ${styles.forgotPasswordButton}`} onClick={() => setAuthMode('password_reset')}>Forgot your password?</button>
                        </>
                    )}

                    {authMode === 'signup' && (<SignUpForm />)}

                    {authMode === 'password_reset' && (<PasswordResetForm />)}
                </div>

                <footer className={styles.authFooter}>
                    <div className={styles.authModeSwitchContainer}>
                        {authMode === 'signin' && (
                            <>
                                <p className={styles.subHeaderText}>New to GiftKeeper?</p>
                                <button className={`unstyled-button ${styles.toggleButton}`} onClick={() => setAuthMode('signup')}>Create an account</button>
                            </>
                        )}

                        {authMode === 'signup' && (
                            <>
                                <p className={styles.subHeaderText}>Already have an account?</p>
                                <button className={`unstyled-button ${styles.toggleButton}`} onClick={() => setAuthMode('signin')}>Sign in</button>
                            </>
                        )}

                        {authMode === 'password_reset' && (
                            <>
                                <p className={styles.subHeaderText}>Remember your password?</p>
                                <button className={`unstyled-button ${styles.toggleButton}`} onClick={() => setAuthMode('signin')}>Back to sign in</button>
                            </>
                        )}
                    </div>

                    <ul className={styles.trustIndicators}>
                        <li className={styles.trustIndicator}><CheckCircle2 size={14} color={'green'} />Free to start</li>
                        <li className={styles.trustIndicator}><CheckCircle2 size={14} color={'green'} />No credit card required</li>
                        <li className={styles.trustIndicator}><CheckCircle2 size={14} color={'green'} />Setup in under 2 minutes</li>
                    </ul>
                </footer>
            </div>
        </div>
    )
}