/**
 * Returns data/statistics about gift items (db, 'users', {userId}, 'giftItems') collection.
 * Useful for dashboard stats and everywhere else in the app
 */

import { useMemo } from "react";
import { useGiftItems } from "../contexts/GiftItemsContext";

interface GiftItemsStats {
    total: number;
    ideas: number;
    purchased: number;
}

// interface FilterOptions {
//     personId?: string;
//     eventId?: string;
// }

export function useGiftStats() : GiftItemsStats {
    const { giftItems } = useGiftItems();

    // TODO:  Add filtering options later.
    // Filter By:  personId or eventId for PersonPage/EventPage.

    return useMemo(() => {

        const stats: GiftItemsStats = {
            total: giftItems.length,
            ideas: giftItems.filter(item => item.status === 'idea').length,
            purchased: giftItems.filter(item => item.status === 'purchased').length,
        }

        return stats
    }, [giftItems])
}