import { sendEmailVerification, sendPasswordResetEmail, signOut } from 'firebase/auth';
import styles from './ProfilePage.module.css'
import { auth } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';

export function ProfilePage () {
    const { authState } = useAuth();

    const handleSignOut = async () => {
        console.log('handleSignOut Triggered');

        try {
            await signOut(auth)
        } catch (error) {
            console.error('Error in handleSignOut:', error);
        }
    }

    const handleVerifyEmail = async () => {
        if (!authState.user || authState.user.emailVerified) { return }; // Guard Clause
        
        try {
            await sendEmailVerification(authState.user);
        } catch (error) {
            console.error('Error sending verification email. Error:', error);
        }
    }

    const handlePasswordReset = async () => {
        if (!authState.user || !authState.user.email) { return }; // Guard Clause

        try {
            await sendPasswordResetEmail(auth, authState.user.email);
        } catch (error) {
            console.error('Error resetting password. Error:', error);
        }
    }

    return (
        <section className={styles.profilePage}>
            <h1>Your Profile & Settings</h1>

            <div className={styles.profileInfo}>
                <div className={styles.avatarContainer}>

                </div>

                <dl className={styles.infoList}>
                    <dt>Email</dt>
                    <dd>{authState.user?.email}</dd>

                    <dt>Display Name</dt>
                    <dd>{authState.user?.displayName}</dd>

                    <dt>Account Created</dt>
                    <dd>{authState.user?.metadata.creationTime}</dd>

                    <dt>Account Verified:</dt>
                    <dd>{authState.user && authState.user.emailVerified ? (<span>Verified</span>) : (<><span>Not Verified</span> <button onClick={handleVerifyEmail}>Verify Email</button></>)}</dd>

                </dl>
            </div>


            <button onClick={handleSignOut}>Sign Out</button>

            <button type='button' onClick={handlePasswordReset}>Reset Password</button>

        </section>
    )
}