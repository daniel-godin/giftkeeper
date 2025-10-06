import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Event } from "../types/EventType";
import { useAuth } from "./AuthContext";
import { getEventsCollRef } from "../firebase/firestore";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { useToast } from "./ToastContext";
import { devError } from "../utils/logger";

interface EventsState {
    events: Event[];
    loading: boolean;
}

const EventsContext = createContext<EventsState | undefined>(undefined);

// Hook for easy access to event data throughout codebase, without using useContext everywhere.
export const useEvents = () => {
    const context = useContext(EventsContext);
    if (context === undefined) { throw new Error('useEvents must be used within a EventsProvider'); }; // Guard
    return context;
}

export function EventsProvider({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();
    const { addToast } = useToast();

    const [eventsState, setEventsState] = useState<EventsState>({
        events: [],
        loading: true
    })

    useEffect(() => {
        // Guard Clause
        if (!authState.user) { 
            setEventsState({ events: [], loading: false });
            return; 
        };

        const collRef = getEventsCollRef(authState.user.uid);
        const eventsQuery = query(collRef, orderBy('date'));

        const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            const data: Event[] = snapshot.docs.map((doc => {
                return doc.data() as Event;
            }))

            setEventsState({
                events: data,
                loading: false
            })

        }, (error) => {
            devError('Error fetching events. Error:', error);

            addToast({
                type: 'error',
                title: 'Error',
                message: 'Unable to load your events.  Please check your connection and try again.',
                error: error as Error
            });

            setEventsState({
                events: [],
                loading: false
            })
        })

        return () => unsubscribe();
    }, [authState.user?.uid]); // Not including addToast, because I don't want to restart the listener for any toast changes.

    const value = useMemo<EventsState>(() => (
        eventsState
    ), [eventsState])

    return (
        <EventsContext.Provider value={value}>
            {children}
        </EventsContext.Provider>
    )
}