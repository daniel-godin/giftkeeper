import { useState } from 'react';
import { FormCheckbox, FormInput, FormSelect } from '../../../../components/ui';
import styles from './EventsFilterSort.module.css';
import { EventsSortOptions } from '../../../../types/EventType';

interface EventsFilterSortProps {
    sortOptions: EventsSortOptions;
    setSortOptions: React.Dispatch<React.SetStateAction<EventsSortOptions>>;
}

// For FormSelect sorting Dropdown in JSX
const sortDropDown = [
    { optionLabel: 'Sort: Title', optionValue: 'title' },
    { optionLabel: 'Sort: Upcoming Event', optionValue: 'date' },
    { optionLabel: 'Sort: Gift Count', optionValue: 'giftCount' },
    { optionLabel: 'Sort: Total Spent', optionValue: 'totalSpent' },
    { optionLabel: 'Sort: Recently Added', optionValue: 'recentlyAdded' },
]

// For FormSelect Dropdown in JSX
const sortDirectionOptions = [
    { optionLabel: 'Asc', optionValue: 'asc' },
    { optionLabel: 'Desc', optionValue: 'desc' },
]

export function EventsFilterSort({ sortOptions, setSortOptions } : EventsFilterSortProps) {

    const [showSortOptions, setShowSortOptions] = useState<boolean>(true);

    const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        const { name, value } = e.target;
        setSortOptions(prev => ({
            ...prev,
            [name]: value
        }))
    }

    return (
        <div className={styles.eventsFilterSort}>
            <header className={`${styles.eventsFilterSortHeader}`} onClick={() => setShowSortOptions(!showSortOptions)}>
                <span>🔍 Filter & Sort</span>
                {showSortOptions ? ( 
                    <button className='unstyled-button'>▼</button>
                ) : (
                    <button className='unstyled-button'>▲</button>
                )}
            </header>

            {showSortOptions && (
                <form className={styles.form} autoComplete='off'>
                    <div className={styles.searchTermAndShowAllEventsContainer}>
                        {/* Text Search Input */}
                        <FormInput
                            type='text'
                            name='searchTerm'
                            placeholder='search events...'
                            value={sortOptions.searchTerm}
                            onChange={handleInputChange}
                        />

                        {/* Use all events, or use just upcomingEvents (default) */}
                        <FormCheckbox
                            // label='Show all events (including past)'
                            name='showAllEvents'
                            checked={sortOptions.showAllEvents}
                            onChange={(checked) => setSortOptions(prev => ({ ...prev, showAllEvents: checked }))}
                            inputClassName={styles.checkbox}
                        />
                    </div>

                    <div className={styles.sortContainer}>
                        {/* Sort By Options: Title, Upcoming Event, Gift Count, Total Spent, or Recently Added */}
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