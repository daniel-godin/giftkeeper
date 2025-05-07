import { Outlet } from 'react-router'
import styles from './Layout.module.css'
import { useViewport } from '../contexts/ViewportContext'
import { BottomNavigation } from './components/BottomNavigation/BottomNavigation';
import { TopBar } from './components/TopBar/TopBar';

export function Layout () {
    const deviceType = useViewport();

    return (
        <div className={styles.layoutContainer}>
            <TopBar deviceType={deviceType} />
            
            <main className={styles.mainContent}>
                <Outlet />
            </main>

            {deviceType === 'mobile' && <BottomNavigation />}
        </div>
    )
}