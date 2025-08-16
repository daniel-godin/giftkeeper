import { useMemo, useState } from 'react';
import { usePeople } from '../../../../contexts/PeopleContext'
import styles from './PeopleTable.module.css'
import { Link } from 'react-router';
import { formatBirthdayShort, getDaysUntilDate, getDaysUntilNextBirthday } from '../../../../utils';
import { Pencil, Trash2 } from 'lucide-react';
import { Person } from '../../../../types/PersonType';
import { DEFAULT_PERSON } from '../../../../constants/defaultObjects';
import { EditPersonModal } from '../../../../components/modals/EditPersonModal/EditPersonModal';
import { usePeopleActions } from '../../../../hooks/usePeopleActions';
import { AddPersonModal } from '../../../../components/modals/AddPersonModal/AddPersonModal';

export function PeopleTable() {
    const { people, loading: loadingPeople } = usePeople();
    const { deletePerson } = usePeopleActions();

    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);
    const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState<boolean>(false);
    const [personBeingEdited, setPersonBeingEdited] = useState<Person>(DEFAULT_PERSON);

    const sortedPeople = useMemo(() => {
        // TODO: Create different ways to sort.
        return people;
    }, [people])

    const handleEditableItem = (person: Person) => {
        setPersonBeingEdited(person);
        setIsEditPersonModalOpen(true);
    }

    const handleDelete = async (person: Person) => {
        const isDeleteSuccessful = await deletePerson(person);
        if (isDeleteSuccessful) {
            // Possible navigation.
        }
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
                                {person.relationship && (<span className={styles.relationTag}>{person.relationship}</span>)}
                            </td>

                            {/* Birthday Information */}
                            <td className={styles.tableCell}>
                                {person.birthday && (
                                    <div className={styles.birthdayInfo}>
                                        <div className={styles.birthdayDate}>{formatBirthdayShort(person.birthday)}</div>
                                        {/* TODO:  ADD "DAYS AWAY" */}
                                        <div className={styles.birthdayCountdown}>{getDaysUntilNextBirthday(person.birthday)} days away</div>
                                    </div>
                                )}
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

            <EditPersonModal
                isOpen={isEditPersonModalOpen}
                onClose={() => setIsEditPersonModalOpen(false)}
                data={personBeingEdited}
            />
        </div>
    )
}