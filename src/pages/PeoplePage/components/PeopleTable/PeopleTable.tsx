import { useState } from 'react';
import { usePeople } from '../../../../contexts/PeopleContext'
import styles from './PeopleTable.module.css'
import { Link } from 'react-router';
import { formatBirthdayShort, getDaysUntilNextBirthday } from '../../../../utils';
import { Pencil, Trash2 } from 'lucide-react';
import { Person } from '../../../../types/PersonType';
import { DEFAULT_PERSON } from '../../../../constants/defaultObjects';
import { EditPersonModal } from '../../../../components/modals/EditPersonModal/EditPersonModal';
import { usePeopleActions } from '../../../../hooks/usePeopleActions';
import { formatCurrency } from '../../../../utils/currencyUtils';
import { FormInput, FormSelect } from '../../../../components/ui';
import { usePeopleFiltered } from '../../../../hooks/usePeopleFiltered';

// For FormSelect sorting Dropdown in JSX
const sortDropDown = [
    { optionLabel: 'Sort: Name', optionValue: 'name' },
    { optionLabel: 'Sort: Upcoming Birthday', optionValue: 'birthday' },
    { optionLabel: 'Sort: Gift Count', optionValue: 'giftCount' },
    { optionLabel: 'Sort: Total Spent', optionValue: 'totalSpent' },
    { optionLabel: 'Sort: Recently Added', optionValue: 'recentlyAdded' },
]

// For FormSelect Dropdown in JSX
const sortDirectionOptions = [
    { optionLabel: 'Asc', optionValue: 'asc' },
    { optionLabel: 'Desc', optionValue: 'desc' },
]

export function PeopleTable() {
    const { loading: loadingPeople } = usePeople();
    const { deletePerson } = usePeopleActions();
    const { sortOptions, setSortOptions, filteredPeople, giftStatsByPerson } = usePeopleFiltered();

    // Modal State
    const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState<boolean>(false);
    const [personBeingEdited, setPersonBeingEdited] = useState<Person>(DEFAULT_PERSON);

    const getBirthdayUrgency = (birthday: string): string => {
        if (!birthday) { return '' }; // Guard for empty string
        const daysUntil = getDaysUntilNextBirthday(birthday);

        if (!daysUntil) { return '' } // No class for invalid dates.  Should be *grey* color.
        if (daysUntil === 0) { return 'urgent' }; // This means TODAY is their birthday.  Very urgent.

        switch (true) {
            case (daysUntil <= 7):
                return 'urgent';
            case (daysUntil <= 21):
                return 'warning';
            default:
                return 'good';
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setSortOptions(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEditableItem = (person: Person) => {
        setPersonBeingEdited(person);
        setIsEditPersonModalOpen(true);
    }

    const handleDelete = async (person: Person) => {
        await deletePerson(person);
    }

    return (
        <div className={styles.peopleTableContainer}>
            <header className={styles.peopleTableHeader}>
                <form className={styles.sortForm} autoComplete='off'>

                    {/* Sort By Options: Name, Upcoming Birthday, Gift Count, Total Spent, or Recently Added */}
                    <FormSelect
                        name='sortBy'
                        options={sortDropDown}
                        value={sortOptions.sortBy}
                        onChange={handleInputChange}
                    />

                    {/* Text Search Input -- Name/Nickname/Relationship */}
                    <FormInput
                        type='text'
                        name='searchTerm'
                        placeholder='search people...'
                        value={sortOptions.searchTerm}
                        onChange={handleInputChange}
                    />

                    {/* Sorting Direction (asc/desc) */}
                    <FormSelect
                        name='sortDirection'
                        options={sortDirectionOptions}
                        value={sortOptions.sortDirection}
                        onChange={handleInputChange}
                        disabled={sortOptions.sortBy === 'recentlyAdded'}
                    />
                </form>
            </header>

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
                        {filteredPeople.map(person => (
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
                                            <div className={styles.birthdayDate}>{formatBirthdayShort(person.birthday)}</div>
                                            {getDaysUntilNextBirthday(person.birthday) ? (
                                                <div 
                                                    className={`${styles.birthdayCountdown} ${styles[getBirthdayUrgency(person.birthday)]}`}
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