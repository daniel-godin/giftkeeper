import { useState } from 'react';
import styles from './AuthPage.module.css'
import { SignInForm } from './components/SignInForm/SignInForm';
import { SignUpForm } from './components/SignUpForm/SignUpForm';

type AuthMode = 'signin' | 'signup';

export function AuthPage () {
    const [authMode, setAuthMode] = useState<AuthMode>('signin');

    return (
        <div className={styles.authPageContainer}>
            <div className={styles.authBoxContainer}>
                <div className={styles.tabs}>
                    {/* Sign In Button */}
                    <button
                        className={`${styles.tab} ${authMode === 'signin' ? styles.activeTab : ''}`}
                        onClick={() => {setAuthMode('signin')}}
                    >
                        Sign In
                    </button>

                    {/* Sign Up Button */}
                    <button
                        className={`${styles.tab} ${authMode === 'signup' ? styles.activeTab : ''}`}
                        onClick={() => {setAuthMode('signup')}}
                    >
                        Sign Up
                    </button>
                </div>

                <div className={styles.formContainer}>
                    {authMode === 'signin' && (<SignInForm />)}

                    {authMode === 'signup' && (<SignUpForm />)}
                </div>
            </div>
        </div>
    )
}