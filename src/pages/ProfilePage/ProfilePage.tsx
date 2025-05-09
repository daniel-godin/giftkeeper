import { signOut } from 'firebase/auth';
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
                </dl>
            </div>


            <button onClick={handleSignOut}>Sign Out</button>




        </section>
    )
}