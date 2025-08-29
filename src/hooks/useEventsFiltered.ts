import { useMemo, useState } from "react";
import { useGiftItems } from "../contexts/GiftItemsContext";
import { getDaysUntilDate } from "../utils";
import { Timestamp } from "firebase/firestore";
import { EventsSortOptions } from "../types/EventType";
import { useEvents } from "../contexts/EventsContext";

export function useEventsFiltered() {
    const { events } = useEvents();
    const { giftItems } = useGiftItems();

    const [sortOptions, setSortOptions] = useState<EventsSortOptions>({ sortBy: 'title', sortDirection: 'asc', searchTerm: '' });

    // Saves number of gift items & total spent in a useMemo so it doesn't have to calculate every rerender.
    const giftStatsByEvent = useMemo(() => {
        const stats: Record<string, { giftCount: number; totalSpent: number }> = {};

        // Sets up Object.personId and puts them at 0 giftCount & 0 totalSpent.
        if (events) {
            events.forEach(event => {
                if (!event.id) { return }; // Guard
                stats[event.id] = { giftCount: 0, totalSpent: 0 };
            })
        }
                
        giftItems.forEach(item => {
            if (!item.eventId) { return }; // Guard.  If no eventId in the giftItem... It can't be attached to anything. SKIP.

            stats[item.eventId].giftCount++;

            if (item.status === 'purchased' && item.purchasedCost) {
                stats[item.eventId].totalSpent += item.purchasedCost;
            }
        })

        return stats;
    }, [giftItems, events]);
    
    const filteredEvents = useMemo(() => {
        let result = [...events];

        // Filter First -- Filtered by Title (maybe people in the future)
        if (sortOptions.searchTerm) {
            result = result.filter(event => {
                const searchTerm = sortOptions.searchTerm.toLowerCase();

                return event.title.toLowerCase().includes(searchTerm)
            })
        }

        // Sort By Name
        if (sortOptions.sortBy === 'title') {
            return result.sort((a, b) => {
                const eventA = a.title.toLowerCase();
                const eventB = b.title.toLowerCase();

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    if (eventA > eventB) { return -1 };
                    if (eventA < eventB) { return 1 };
                    return 0
                }

                if (eventA < eventB) { return -1 };
                if (eventA > eventB) { return 1 };
                return 0
            })
        }

        if (sortOptions.sortBy === 'date') {
            return result.sort((a, b) => {
                const eventA = getDaysUntilDate(a.date || '');
                const eventB = getDaysUntilDate(b.date || '');

                // Handle missing birthdays -- Put At Bottom of List
                if (!eventA && !eventB) { return 0 };
                if (!eventA) { return 1 };
                if (!eventB) { return -1 };

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    return eventB - eventA;
                }

                return eventA - eventB;
            })
        }

        // Sorts 'desc' (always) by recently added. Uses Firestore Timestamp.seconds for comparison
        if (sortOptions.sortBy === 'recentlyAdded') {
            return result.sort((a, b) => {
                const eventA: Timestamp = a.createdAt as Timestamp;
                const eventB: Timestamp = b.createdAt as Timestamp;

                // Handle missing timestamp objects - always put at bottom
                if (!eventA && !eventB) { return 0 };
                if (!eventA) { return 1 };
                if (!eventB) { return -1 };

                // Get Firestore Timestamp.seconds for comparison
                const timestampA = eventA.seconds;
                const timestampB = eventB.seconds;

                // ALWAYS return 'desc', "recently added" makes no sense to have oldest first, ever.
                return timestampB - timestampA;
            })
        }

        if (sortOptions.sortBy === 'giftCount') {
            return result.sort((a, b) => {
                const giftCountA = giftStatsByEvent[a.id || '']?.giftCount || 0;
                const giftCountB = giftStatsByEvent[b.id || '']?.giftCount || 0;

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    return giftCountB - giftCountA;
                }

                return giftCountA - giftCountB;
            })
        }

        if (sortOptions.sortBy === 'totalSpent') {
            return result.sort((a, b) => {
                const totalSpentA = giftStatsByEvent[a.id || '']?.totalSpent || 0;
                const totalSpentB = giftStatsByEvent[b.id || '']?.totalSpent || 0;

                // Descending
                if (sortOptions.sortDirection === 'desc') {
                    return totalSpentB - totalSpentA;
                }

                return totalSpentA - totalSpentB;
            })
        }

        return result;
        
    }, [events, sortOptions, giftStatsByEvent])

    return { sortOptions, setSortOptions, filteredEvents, giftStatsByEvent }
}