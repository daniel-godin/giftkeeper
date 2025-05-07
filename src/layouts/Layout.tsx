import { Outlet } from 'react-router'
import styles from './Layout.module.css'

export function Layout () {
    return (
        <div className={styles.layoutContainer}>
            

            <main className={styles.mainContent}>
                <Outlet />
            </main>


            
        </div>
    )
}