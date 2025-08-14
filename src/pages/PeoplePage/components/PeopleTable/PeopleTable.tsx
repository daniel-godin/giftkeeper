import { useMemo } from 'react';
import { usePeople } from '../../../../contexts/PeopleContext'
import styles from './PeopleTable.module.css'
import { Link } from 'react-router';
import { getDaysUntilDate } from '../../../../utils';
import { Pencil, Trash2 } from 'lucide-react';
import { Person } from '../../../../types/PersonType';

export function PeopleTable() {
    const { people, loading: loadingPeople } = usePeople();

    const sortedPeople = useMemo(() => {
        // TODO: Create different ways to sort.
        return people;
    }, [people])

    const handleEditableItem = (person: Person) => {
        console.log('handleEditableItem')
    }

    const handleDelete = async (person: Person) => {
        console.log('handleDelete');
    }

    return (
        <div className={styles.peopleTableContainer}>
            <header className={styles.peopleTableHeader}>
                <span>Sort People</span>
                <span>Sort Name</span>
                <span>Search People</span>
            </header>

            <table className={styles.peopleTable}>
                <thead className={styles.tableHeader}>
                    <tr className={styles.tableRow}>
                        <th>NAME</th>
                        <th>RELATION</th>
                        <th>BIRTHDAY</th>
                        <th>GIFTS</th>
                        <th>SPENT</th>
                        <th>ACTIONS</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedPeople.map(person => (
                        <tr key={person.id} className={styles.tableRow}>
                            {/* Person Name + First Letter Avatar */}
                            <td className={styles.tableCell}>
                                <div className={styles.nameWithAvatar}>
                                    <div className={styles.avatar}>{person.name.slice(0, 1)}</div>
                                    <Link to={`/people/${person.id}`} className={`unstyled-link ${styles.personName}`}>{person.name}</Link>
                                </div>
                            </td>

                            {/* Relation To User */}
                            <td className={styles.tableCell}>
                                <span className={styles.relationTag}>{person.relationship}</span>
                            </td>

                            {/* Birthday Information */}
                            <td className={styles.tableCell}>
                                <div className={styles.birthdayInfo}>
                                    <div className={styles.birthdayDate}>{person.birthday}</div>
                                    {/* TODO:  ADD "DAYS AWAY" */}
                                    <div className={styles.birthdayCountdown}>{person.birthday ? getDaysUntilDate(person.birthday) : 'N/A'}</div>
                                </div>
                            </td>

                            {/* Number of Gifts */}
                            <td className={styles.tableCell}>
                                {/* TODO:  Hook up giftItems with filters in a useMemo probably */}
                                <span className={styles.giftCount}>5</span>
                            </td>

                            {/* Total Spent On Person */}
                            <td className={styles.tableCell}>
                                {/* TODO:  Hook up giftItems with purchasedCost filter in a useMemo */}
                                <span className={styles.spentAmount}>$240</span>
                            </td>

                            {/* Actions:  Edit/Delete Person */}
                            <td className={styles.tableCell}>
                                <div className={styles.actionButtonsContainer}>


                                    {/* Edit Button -- Opens "EditGiftItemModal" */}
                                    <button 
                                        type='button'
                                        className='unstyled-button'
                                        onClick={() => handleEditableItem(person) }
                                    >
                                        <Pencil />
                                    </button>

                                    {/* Delete Button -- Deletes Gift Item */}
                                    <button 
                                        type='button'
                                        className='unstyled-button'
                                        onClick={() => handleDelete(person) }
                                    >
                                        <Trash2
                                            color='#dc3545'
                                        />
                                    </button>
                                </div>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}