// Returns Upcoming Events
// Either "all" upcoming events, or events for a specific "person"

import { useMemo } from "react";
import { useEvents } from "../contexts/EventsContext";

export function useUpcomingEvents(personId?: string, timePeriod?: '30days' | '90days' | 'thisyear') {
    const { events } = useEvents();

    return useMemo(() => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayTimestamp = today.getTime();

        // Base Filter: Events From Today Forward
        let filtered = events.filter(event => {
            if (!event.date) { return false }; // Guard
            const eventTimestamp = new Date(event.date).getTime(); // Convert Event "YYYY-MM-DD" to Timestamp
            return eventTimestamp >= todayTimestamp; // If Event Timestamp is greater than or equal to TodayTimestamp, add it to the filtered events
        })

        // OPTIONAL:  Returns filtered "upcoming events" within 30 days, 90 days, or this year.
        switch (timePeriod) {
            case '30days':
                const thirtyOneDaysTimestamp = todayTimestamp + (31 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(event => { 
                    const eventTimestamp = new Date(event.date).getTime();
                    return eventTimestamp <= thirtyOneDaysTimestamp;
                })
                break;
            case '90days':
                const ninetyOneDaysTimestamp = todayTimestamp + (91 * 24 * 60 * 60 * 1000);
                filtered = filtered.filter(event => { 
                    const eventTimestamp = new Date(event.date).getTime();
                    return eventTimestamp <= ninetyOneDaysTimestamp;
                })
                break;
            case 'thisyear':
                const nextYearTimestamp = new Date(today.getFullYear() + 1, 0, 1).getTime(); // Jan 1, next year
                filtered = filtered.filter(event => { 
                    const eventTimestamp = new Date(event.date).getTime();
                    return eventTimestamp < nextYearTimestamp;
                })
                break;
        }

        // Optionally returns only a single "person", instead of all upcoming events.
        if (personId) {
            filtered = filtered.filter(event => event.people?.includes(personId) ?? false);
        }

        // Sort Events
        const sortedEvents = filtered.sort((a, b) => {
            const aTime = new Date(a.date || '').getTime();
            const bTime = new Date(b.date || '').getTime();
            return aTime - bTime;
        })

        return sortedEvents;
    }, [events, personId, timePeriod])
}