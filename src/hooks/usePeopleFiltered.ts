import { useMemo, useState } from "react";
import { usePeople } from "../contexts/PeopleContext";
import { useGiftItems } from "../contexts/GiftItemsContext";
import { getDaysUntilNextBirthday } from "../utils";
import { Timestamp } from "firebase/firestore";

type SortByOptions = 'name' | 'birthday' | 'giftCount' | 'totalSpent' | 'recentlyAdded';

export interface PeopleSortOptions {
    sortBy: SortByOptions;
    sortDirection: 'asc' | 'desc';
    searchTerm: string;
}

export function usePeopleFiltered() {
    const { people } = usePeople();
    const { giftItems } = useGiftItems();

    const [sortOptions, setSortOptions] = useState<PeopleSortOptions>({ sortBy: 'name', sortDirection: 'asc', searchTerm: '' });

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
    
    const filteredPeople = useMemo(() => {
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

        // Sorts 'desc' (always) by recently added. Uses Firestore Timestamp.seconds for comparison
        if (sortOptions.sortBy === 'recentlyAdded') {
            return result.sort((a, b) => {
                const personA: Timestamp = a.createdAt as Timestamp;
                const personB: Timestamp = b.createdAt as Timestamp;

                // Handle missing timestamp objects - always put at bottom
                if (!personA && !personB) { return 0 };
                if (!personA) { return 1 };
                if (!personB) { return -1 };

                // Get Firestore Timestamp.seconds for comparison
                const timestampA = personA.seconds;
                const timestampB = personB.seconds;

                // ALWAYS return 'desc', "recently added" makes no sense to have oldest first, ever.
                return timestampB - timestampA;
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
        
    }, [people, sortOptions, giftStatsByPerson])

    return { sortOptions, setSortOptions, filteredPeople, giftStatsByPerson }
}