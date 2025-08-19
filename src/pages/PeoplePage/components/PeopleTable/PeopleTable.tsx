import { useEffect, useMemo, useState } from 'react';
import { usePeople } from '../../../../contexts/PeopleContext'
import styles from './PeopleTable.module.css'
import { Link } from 'react-router';
import { formatBirthdayShort, getDaysUntilNextBirthday } from '../../../../utils';
import { Pencil, Trash2 } from 'lucide-react';
import { Person } from '../../../../types/PersonType';
import { DEFAULT_PERSON } from '../../../../constants/defaultObjects';
import { EditPersonModal } from '../../../../components/modals/EditPersonModal/EditPersonModal';
import { usePeopleActions } from '../../../../hooks/usePeopleActions';
import { useGiftItems } from '../../../../contexts/GiftItemsContext';
import { formatCurrency } from '../../../../utils/currencyUtils';
import { FormInput, FormSelect } from '../../../../components/ui';

type SortByOptions = 'name' | 'birthday' | 'giftCount' | 'totalSpent' | 'recentlyAdded';

interface PeopleSortOptions {
    sortBy: SortByOptions;
    sortDirection: 'asc' | 'desc';
    searchTerm: string;
}

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
    const { people, loading: loadingPeople } = usePeople();
    const { giftItems } = useGiftItems();
    const { deletePerson } = usePeopleActions();

    const [sortOptions, setSortOptions] = useState<PeopleSortOptions>({ sortBy: 'name', sortDirection: 'asc', searchTerm: '' });

    // Modal State
    const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState<boolean>(false);
    const [personBeingEdited, setPersonBeingEdited] = useState<Person>(DEFAULT_PERSON);

    // TODO: DELETE THIS AFTER DEV
    // useEffect(() => {
    //     console.log('sortOptions:', sortOptions);
    // }, [sortOptions])

    // Saves number of gift items & total spent in a useMemo so it doesn't have to calculate every rerender.
    const giftStatsByPerson = useMemo(() => {
        const stats: Record<string, { giftCount: number; totalSpent: number }> = {};

        // Sets up Object.personId and puts them at 0 giftCount & 0 totalSpent.
        if (people) {
            people.forEach(person => {
                if (!person.id) { return }; // Guard
                stats[person.id] = { giftCount: 0, totalSpent: 0 };
            })
        }

        giftItems.forEach(item => {
            if (!item.personId) { return }; // Guard.  If no personId in the giftItem... It can't be attached to anything. SKIP.

            stats[item.personId].giftCount++;

            if (item.status === 'purchased' && item.purchasedCost) {
                stats[item.personId].totalSpent += item.purchasedCost;
            }
        })

        return stats;
    }, [giftItems, people]);

    const sortedPeople = useMemo(() => {
        let result = [...people];

        // Filter First -- Filtered by Name, Nickname, or Relationship
        if (sortOptions.searchTerm) {
            result = result.filter(person => {
                const searchTerm = sortOptions.searchTerm.toLowerCase();

                return person.name.toLowerCase().includes(searchTerm) || 
                (person.nickname && person.nickname.toLowerCase().includes(searchTerm)) ||
                (person.relationship && person.relationship.toLowerCase().includes(searchTerm))
            })
        }

        // Sort By Name
        if (sortOptions.sortBy === 'name') {
            return result.sort((a, b) => {
                const personA = a.name.toLowerCase();
                const personB = b.name.toLowerCase();

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    if (personA > personB) { return -1 };
                    if (personA < personB) { return 1 };
                    return 0
                }

                if (personA < personB) { return -1 };
                if (personA > personB) { return 1 };
                return 0
            })
        }

        if (sortOptions.sortBy === 'birthday') {
            return result.sort((a, b) => {
                const personA = getDaysUntilNextBirthday(a.birthday || '');
                const personB = getDaysUntilNextBirthday(b.birthday || '');

                // Handle missing birthdays -- Put At Bottom of List
                if (!personA && !personB) { return 0 };
                if (!personA) { return 1 };
                if (!personB) { return -1 };

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    return personB - personA;
                }

                return personA - personB;
            })
        }

        // TODO:  FIX THIS TO USE FIREBASE/FIRESTORE TIMESTAMP OBJECTS (seconds/milliseconds)
        if (sortOptions.sortBy === 'recentlyAdded') {
            return result.sort((a, b) => {
                const personA = a.createdAt;
                const personB = b.createdAt;

                // Handle missing timestamps - always put at bottom
                if (!personA && !personB) { return 0 };
                if (!personA) { return 1 };
                if (!personB) { return -1 };

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    if (personA < personB) { return -1 };
                    if (personA > personB) { return 1 };
                    return 0
                }

                if (personA > personB) { return -1 };
                if (personA < personB) { return 1 };
                return 0
            })
        }

        if (sortOptions.sortBy === 'giftCount') {
            return result.sort((a, b) => {
                const giftCountA = giftStatsByPerson[a.id || '']?.giftCount || 0;
                const giftCountB = giftStatsByPerson[b.id || '']?.giftCount || 0;

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    return giftCountB - giftCountA;
                }

                return giftCountA - giftCountB;
            })
        }

        if (sortOptions.sortBy === 'totalSpent') {
            return result.sort((a, b) => {
                const totalSpentA = giftStatsByPerson[a.id || '']?.totalSpent || 0;
                const totalSpentB = giftStatsByPerson[b.id || '']?.totalSpent || 0;

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    return totalSpentB - totalSpentA;
                }

                return totalSpentA - totalSpentB;
            })
        }

        return result;
    }, [people, sortOptions, sortOptions.searchTerm, sortOptions.sortBy]);

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
                    />
                </form>
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
                                            <div className={styles.birthdayCountdown}>{getDaysUntilNextBirthday(person.birthday)} days away</div>
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

            <EditPersonModal
                isOpen={isEditPersonModalOpen}
                onClose={() => setIsEditPersonModalOpen(false)}
                data={personBeingEdited}
            />
        </div>
    )
}