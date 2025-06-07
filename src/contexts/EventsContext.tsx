import { createContext, useContext, useEffect, useState } from "react";
import { Event } from "../types/EventType";
import { useAuth } from "./AuthContext";
import { getEventsCollection } from "../firebase/firestore";
import { onSnapshot, orderBy, query } from "firebase/firestore";

interface EventsState {
    events: Event[];
    loading: boolean;
    error?: string;
}

const EventsContext = createContext<EventsState | undefined>(undefined);

export const useEvents = () => {
    const context = useContext(EventsContext);

    // Guard Clause
    if (context === undefined) { throw new Error('useEvents must be used within a EventsProvider'); };

    return context;
}

export function EventsProvider({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();

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

        const collRef = getEventsCollection(authState.user.uid);
        const eventsQuery = query(collRef, orderBy('date'));

        const unsubscribe = onSnapshot(eventsQuery, (snapshot) => {
            const data: Event[] = [];

            snapshot.forEach((doc) => {
                data.push(doc.data() as Event);
            })

            setEventsState({
                events: data,
                loading: false
            })
        }, (error) => {
            console.error('Error fetching events. Error:', error);
            setEventsState({
                events: [],
                loading: false
            })
        })

        return () => unsubscribe();
    }, [authState.user?.uid]);

    return (
        <EventsContext.Provider value={eventsState}>
            {children}
        </EventsContext.Provider>
    )
}