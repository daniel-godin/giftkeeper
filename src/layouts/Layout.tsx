import { Outlet } from 'react-router'
import styles from './Layout.module.css'

export function Layout () {
    return (
        <div className={styles.layout}>
            <div className={styles.navContainer}></div>
            <div className={styles.topHeaderContainer}></div>
            <div className={styles.mainContentContainer}>
                <Outlet />
            </div>
        </div>
    )
}