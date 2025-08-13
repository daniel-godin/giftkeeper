import { useState } from 'react';
import { QuickActionButton } from '../../../../components/ui/QuickActionButton/QuickActionButton'
import styles from './PeopleHeader.module.css'
import { UsersRound } from 'lucide-react';
import { StatCard } from '../../../../components/ui/StatCard/StatCard';
import { usePeople } from '../../../../contexts/PeopleContext';

export function PeopleHeader() {
    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);

    const { people, loading: loadingPeople } = usePeople();
    

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

            <div className={styles.statsOverview}>
                <StatCard
                    to='/people'
                    title='PEOPLE'
                    totalCount={people.length}
                    breakdownStats={[
                        // TODO: FIX THIS
                        {count: people.length, label: 'total'}
                    ]}
                />

            </div>
        </header>
    )
}