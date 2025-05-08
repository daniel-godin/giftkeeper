import { signOut } from 'firebase/auth';
import styles from './ProfilePage.module.css'
import { auth } from '../../firebase/firebase';

export function ProfilePage () {

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
            <button onClick={handleSignOut}>Sign Out</button>




        </section>
    )
}