// Returns Upcoming Events
// Either "all" upcoming events, or events for a specific "person"

import { useMemo } from "react";
import { useEvents } from "../contexts/EventsContext";

export function useUpcomingEvents(personId?: string) {
    const { events } = useEvents();

    return useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        let filtered = events.filter(event => event.date && event.date >= today);

        // Optionally returns only a single "person", instead of all upcoming events.
        if (personId) {
            filtered = filtered.filter(event => event.people?.includes(personId) ?? false);
        }

        return filtered.sort((a, b) => (a.date || '').localeCompare(b.date || ''))
    }, [events, personId])
}