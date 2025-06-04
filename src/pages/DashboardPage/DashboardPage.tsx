import { useAuth } from '../../contexts/AuthContext'
import styles from './DashboardPage.module.css'

export function DashboardPage () {
    const { authState } = useAuth();

    
    return (
        <>Dashboard</>
    )
}