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

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setSortOptions(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
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
    )
}