import { Outlet } from 'react-router'
import styles from './Layout.module.css'
import { useViewport } from '../contexts/ViewportContext'
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';
import { TopBar } from './components/TopBar/TopBar';
import { Onboarding } from '../components/Onboarding/Onboarding';
import { usePeople } from '../contexts/PeopleContext';

export function Layout () {
    const deviceType = useViewport();
    const { people, loading } = usePeople();

    if (loading) { return <div>Loading...</div> };

    return (
        <div className={styles.layoutContainer}>
            <TopBar deviceType={deviceType} />
            
            <main className={styles.mainContent}>
                {people.length >= 1 ? (
                    <Outlet />
                ) : (
                    <Onboarding />
                )}
            </main>

            {deviceType === 'mobile' && <BottomNavigation />}
        </div>
    )
}

// function EmailVerificationMessage() {
//     const { authState } = useAuth();

//     const [lockEmailSend, setLockEmailSend] = useState<boolean>(false);

//     useEffect(() => {
//         let timeoutId: NodeJS.Timeout;
//         if (lockEmailSend) {
//             timeoutId = setTimeout(() => {
//                 setLockEmailSend(false);
//             }, 60000);
//         }

//         return () => clearTimeout(timeoutId);
//     }, [lockEmailSend])

//     const handleVerifyEmail = async () => {
//         if (!authState.user) { return }; // Guard Clause
//         try { 
//             await sendEmailVerification(authState.user);
//             setLockEmailSend(true);
//         } catch (error) { 
//             console.error('Error trying to send verification email. Error:', error); 
//             setLockEmailSend(false);
//         }
//     }

//     return (
//         <div className={styles.verifyEmailMessageContainer}>
//             <p>Please verify your email.</p>
//             <button type="button" onClick={handleVerifyEmail} disabled={lockEmailSend}>Resend Verification Email</button>
//             {lockEmailSend && (<p>Please wait 1 minute before trying again</p>)}
//         </div>
//     )
// }

