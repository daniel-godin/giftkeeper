import { useState } from 'react';
import { FormInput, FormSelect } from '../../../../components/ui'
import { useGiftItems } from '../../../../contexts/GiftItemsContext';
import { usePeople } from '../../../../contexts/PeopleContext';
import { PeopleSortOptions } from '../../../../hooks/usePeopleFiltered';
import styles from './PeopleFilterSort.module.css'

interface PeopleFilterSortProps {
    sortOptions: PeopleSortOptions;
    setSortOptions: React.Dispatch<React.SetStateAction<PeopleSortOptions>>;
}

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

export function PeopleFilterSort({ sortOptions, setSortOptions } : PeopleFilterSortProps) {

    const [showSortOptions, setShowSortOptions] = useState<boolean>(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setSortOptions(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className={styles.peopleFilterSort}>
            <header className={styles.peopleFilterSortHeader}>
                <span>🔍 Filter & Sort</span>
                {showSortOptions ? ( 
                    <button className='unstyled-button' onClick={() => setShowSortOptions(false)}>▼</button>
                ) : (
                    <button className='unstyled-button' onClick={() => setShowSortOptions(true)}>▲</button>
                )}
            </header>

            {showSortOptions && (
                <form className={styles.form} autoComplete='off'>

                    {/* Text Search Input -- Name/Nickname/Relationship */}
                    <FormInput
                        type='text'
                        name='searchTerm'
                        placeholder='search people...'
                        value={sortOptions.searchTerm}
                        onChange={handleInputChange}
                    />

                    <div className={styles.sortContainer}>
                        {/* Sort By Options: Name, Upcoming Birthday, Gift Count, Total Spent, or Recently Added */}
                        <FormSelect
                            name='sortBy'
                            options={sortDropDown}
                            value={sortOptions.sortBy}
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
                    </div>
                </form>
            )}
        </div>
    )
}