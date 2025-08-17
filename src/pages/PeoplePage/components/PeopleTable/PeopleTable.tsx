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

type SortByOptions = 'name' | 'birthday' | 'giftCount' | 'recentlyAdded';

interface PeopleSortOptions {
    sortBy: SortByOptions;
    sortDirection: 'asc' | 'desc';
    searchTerm: string;
}

const sortDropDown = [
    { optionLabel: 'Name', optionValue: 'name' },
    { optionLabel: 'Birthday', optionValue: 'birthday' },
    { optionLabel: 'Gift Count', optionValue: 'giftCount' },
    { optionLabel: 'Recently Added', optionValue: 'recentlyAdded' },

]

export function PeopleTable() {
    const { people, loading: loadingPeople } = usePeople();
    const { giftItems } = useGiftItems();
    const { deletePerson } = usePeopleActions();

    const [sortOptions, setSortOptions] = useState<PeopleSortOptions>({sortBy: 'name', sortDirection: 'asc', searchTerm: ''});

    // Modal State
    const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState<boolean>(false);
    const [personBeingEdited, setPersonBeingEdited] = useState<Person>(DEFAULT_PERSON);

    // TODO: DELETE THIS AFTER DEV
    // useEffect(() => {
    //     console.log('sortOptions:', sortOptions);
    // }, [sortOptions])

    const sortedPeople = useMemo(() => {
        let result = [...people];

        // Filter First
        if (sortOptions.searchTerm) {
            result = result.filter(person => {
                return person.name.toLowerCase().includes(sortOptions.searchTerm.toLowerCase());
            })
        }

        // TODO: Create different ways to sort.
        if (sortOptions.sortBy === 'name') {
            return result.sort((a, b) => {
                const personA = a.name.toUpperCase();
                const personB = b.name.toUpperCase();
                if (personA < personB) { return -1 };
                if (personA > personB) { return 1 };
                return 0
            })
        }

        if (sortOptions.sortBy === 'recentlyAdded') {
            return result.sort((a, b) => {
                const personA = a.createdAt;
                const personB = b.createdAt;
                if (!personA || !personB) { return 0 };
                if (personA > personB) { return -1 };
                if (personA < personB) { return 1 };
                return 0
            })
        }

        return result;
    }, [people, sortOptions, sortOptions.searchTerm]);

    // Saves number of gift items & total spent in a useMemo so it doesn't have to calculate every rerender.
    const giftStatsByPerson = useMemo(() => {
        const stats: Record<string, { giftCount: number; totalSpent: number }> = {};

        giftItems.forEach(item => {
            if (!item.personId) { return }; // Guard

            if (!stats[item.personId]) {
                stats[item.personId] = { giftCount: 0, totalSpent: 0 };
            }

            stats[item.personId].giftCount++;

            if (item.status === 'purchased' && item.purchasedCost) {
                stats[item.personId].totalSpent += item.purchasedCost;
            }
        })

        return stats;
    }, [giftItems]);

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
                    <FormSelect
                        name='sortBy'
                        options={sortDropDown}
                        value={sortOptions.sortBy}
                        onChange={handleInputChange}
                    />

                    <FormInput
                        type='text'
                        name='searchTerm'
                        value={sortOptions.searchTerm}
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