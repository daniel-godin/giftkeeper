import { useState } from 'react';
import { usePeople } from '../../../../contexts/PeopleContext'
import styles from './PeopleTable.module.css'
import { Link } from 'react-router';
import { formatDateShort, getDaysUntilNextBirthday, getEventUrgency } from '../../../../utils';
import { Pencil, Trash2 } from 'lucide-react';
import { Person } from '../../../../types/PersonType';
import { DEFAULT_PERSON } from '../../../../constants/defaultObjects';
import { EditPersonModal } from '../../../../components/modals/EditPersonModal/EditPersonModal';
import { usePeopleActions } from '../../../../hooks/usePeopleActions';
import { formatCurrency } from '../../../../utils/currencyUtils';

interface PeopleTableProps {
    people: Person[];
    giftStatsByPerson: Record<string, { giftCount: number; totalSpent: number }>
}

export function PeopleTable({ people, giftStatsByPerson } : PeopleTableProps) {
    const { loading: loadingPeople } = usePeople();
    const { deletePerson } = usePeopleActions();

    // Modal State
    const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState<boolean>(false);
    const [personBeingEdited, setPersonBeingEdited] = useState<Person>(DEFAULT_PERSON);

    const handleEditableItem = (person: Person) => {
        setPersonBeingEdited(person);
        setIsEditPersonModalOpen(true);
    }

    const handleDelete = async (person: Person) => {
        await deletePerson(person);
    }

    return (
        <div className={styles.peopleTableContainer}>

            {/* Table With People Data */}
            {loadingPeople ? (
                <SkeletonTable rows={5} />
            ) : (
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
                        {people.map(person => (
                            <tr key={person.id} className={styles.tableRow}>
                                {/* Person Name + First Letter Avatar */}
                                <td className={styles.tableCell}>
                                    <Link to={`/people/${person.id}`} className={`unstyled-link ${styles.personName}`}>
                                        <div className={styles.nameWithAvatar}>
                                            <div className={styles.avatar}>{person.name.slice(0, 1)}</div>
                                            {person.name}
                                        </div>
                                    </Link>
                                </td>

                                {/* Relation To User */}
                                <td className={styles.tableCell}>
                                    {person.relationship && (<span className={styles.relationTag}>{person.relationship}</span>)}
                                </td>

                                {/* Birthday Information */}
                                <td className={styles.tableCell}>
                                    {person.birthday && (
                                        <div className={styles.birthdayInfo}>
                                            <div className={styles.birthdayDate}>{formatDateShort(person.birthday)}</div>
                                            {getDaysUntilNextBirthday(person.birthday) ? (
                                                <div 
                                                    className={`${styles.birthdayCountdown} ${styles[getEventUrgency(person.birthday, 'birthday')]}`}
                                                >
                                                    {getDaysUntilNextBirthday(person.birthday)} days away
                                                </div>
                                            ) : (
                                                <div className={styles.birthdayCountdown}>--</div>
                                            )}
                                        </div>
                                    )}
                                </td>

                                {/* Number of Gifts For Each Person (person.id) */}
                                <td className={styles.tableCell}>
                                    {person.id && giftStatsByPerson && giftStatsByPerson[person.id] && (
                                        <span className={styles.giftCount}>{giftStatsByPerson[person.id].giftCount}</span>
                                    )}
                                </td>

                                {/* Total Spent On Person */}
                                <td className={styles.tableCell}>
                                    {person.id && giftStatsByPerson && giftStatsByPerson[person.id] && (
                                        <span className={styles.spentAmount}>{formatCurrency(giftStatsByPerson[person.id].totalSpent)}</span>
                                    )}
                                </td>

                                {/* Actions:  Edit/Delete Person */}
                                <td className={styles.tableCell}>
                                    <div className={styles.actionButtonsContainer}>

                                        {/* Edit Button -- Opens "EditPersonModal" */}
                                        <button 
                                            type='button'
                                            className='unstyled-button'
                                            onClick={() => handleEditableItem(person) }
                                        >
                                            <Pencil />
                                        </button>

                                        {/* Delete Button -- Deletes Person */}
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
            )}
            
            <EditPersonModal
                isOpen={isEditPersonModalOpen}
                onClose={() => setIsEditPersonModalOpen(false)}
                data={personBeingEdited}
            />
        </div>
    )
}

const SkeletonTable = ({ rows = 5 }) => {

    return (
        <table className={styles.peopleTable}>
            <thead className={styles.tableHeader}>
                <tr>
                    <th>NAME</th>
                    <th>RELATION</th>
                    <th>BIRTHDAY</th>
                    <th>GIFTS</th>
                    <th>SPENT</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {Array(rows).fill(0).map((_, i) => (
                    <tr key={i} className={styles.tableRow}>
                        <td className={styles.tableCell}>
                            <div className="skeleton-line" style={{ width: '100%' }} />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>  
    )
}