import { sendEmailVerification, sendPasswordResetEmail, signOut } from 'firebase/auth';
import styles from './ProfilePage.module.css'
import { auth } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { devError } from '../../utils/logger';

export function ProfilePage () {
    const { authState } = useAuth();
    const { addToast } = useToast();

    const handleSignOut = async () => {

        try {
            await signOut(auth);
            addToast({
                type: 'success',
                title: 'Signed Out',
                message: 'You have been successfully signed out.'
            });
        } catch (error) {
            devError('Error in handleSignOut:', error);
            addToast({
                type: 'error',
                title: 'Error Signing Out',
                message: 'Unable to sign you out.  Please try again.',
                error: error as Error
            });
        }
    }

    const handleVerifyEmail = async () => {
        if (!authState.user || authState.user.emailVerified) { return }; // Guard Clause
        
        try {
            await sendEmailVerification(authState.user);
            addToast({
                type: 'info',
                title: 'Verification Email Sent',
                message: 'Email verification sent. Please check your email.'
            })
        } catch (error) {
            devError('Error sending verification email. Error:', error);
            addToast({
                type: 'error',
                title: 'Error Sending Verification',
                message: 'Unable to send verification email.  Please try again.',
                error: error as Error
            })
        }
    }

    const handlePasswordReset = async () => {
        if (!authState.user || !authState.user.email) { return }; // Guard Clause

        try {
            await sendPasswordResetEmail(auth, authState.user.email);
            addToast({
                type: 'info',
                title: 'Password Reset Email Sent',
                message: 'Password reset email sent. Please check your email.'
            })
        } catch (error) {
            devError('Error resetting password. Error:', error);
            addToast({
                type: 'error',
                title: 'Error Sending Password Reset',
                message: 'Unable to send password reset email.  Please try again.',
                error: error as Error
            })
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