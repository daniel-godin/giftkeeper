import { usePeople } from '../../../../contexts/PeopleContext'
import styles from './PeopleList.module.css'

export function PeopleList() {
    const { people } = usePeople();

    return (
        <div className={styles.peopleListContainer}>
            <header className={styles.peopleListHeader}>
                {/* # of people found */}

                {/* List/Grid toggle?? */}
            </header>

            {/* Mapping of "filtered/sorted people" */}
            {/* {people.map(person => (
                // PersonCard
            ))} */}
        </div>
    )
}