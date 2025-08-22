import { FormInput, FormSelect } from '../../../../components/ui'
import { useGiftItems } from '../../../../contexts/GiftItemsContext';
import { usePeople } from '../../../../contexts/PeopleContext';
import styles from './PeopleFilterSort.module.css'

export function PeopleFilterSort() {

    return (
        <form className={styles.sortForm} autoComplete='off'>

            {/* Sort By Options: Name, Upcoming Birthday, Gift Count, Total Spent, or Recently Added */}
            {/* <FormSelect
                name='sortBy'
                options={sortDropDown}
                value={sortOptions.sortBy}
                onChange={handleInputChange}
            /> */}

            {/* Text Search Input -- Name/Nickname/Relationship */}
            {/* <FormInput
                type='text'
                name='searchTerm'
                placeholder='search people...'
                value={sortOptions.searchTerm}
                onChange={handleInputChange}
            /> */}

            {/* Sorting Direction (asc/desc) */}
            {/* <FormSelect
                name='sortDirection'
                options={sortDirectionOptions}
                value={sortOptions.sortDirection}
                onChange={handleInputChange}
                disabled={sortOptions.sortBy === 'recentlyAdded'}
            /> */}
        </form>
    )
}