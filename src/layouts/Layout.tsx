import { Outlet } from 'react-router'
import styles from './Layout.module.css'
import { NavPanel } from './components/NavPanel/NavPanel'

export function Layout () {
    return (
        <div className={styles.layout}>
            <div className={styles.navContainer}><NavPanel /></div>
            <div className={styles.topHeaderContainer}></div>
            <div className={styles.mainContentContainer}>
                <Outlet />
            </div>
        </div>
    )
}