import { QuickActionButton } from '../../../../components/ui/QuickActionButton/QuickActionButton'
import styles from './PeopleHeader.module.css'

export function PeopleHeader() {

    return (
        <header className={styles.peopleHeader}>
            <div className={styles.titleAndQuickActionButtonsContainer}>
                <h2 className={styles.pageTitle}>People</h2>

                    <QuickActionButton
                        icon={<UsersRound />}
                        text='Add Person'
                        onClick={() => setIsAddPersonModalOpen(true)}
                        variant='secondary'
                    />
            </div>
        </header>
    )
}