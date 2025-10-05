import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Person } from "../types/PersonType";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { getPeopleCollRef } from "../firebase/firestore";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";
import { devError } from "../utils/logger";

interface PeopleState {
    people: Person[];
    loading: boolean;
}

const PeopleContext = createContext<PeopleState | undefined>(undefined);

// Hook for easy access to people data throughout the code, without using useContext everywhere
export const usePeople = () => {
    const context = useContext(PeopleContext);
    if (context === undefined) { throw new Error('usePeople must be used within a PeopleProvider'); }; // Guard
    return context;
}

export function PeopleProvider({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();
    const { addToast } = useToast();

    const [peopleState, setPeopleState] = useState<PeopleState>({
        people: [],
        loading: true
    })

    useEffect(() => {
        if (!authState.user) { // Guard against no user
            setPeopleState({ people: [], loading: false });
            return; 
        };

        const collRef = getPeopleCollRef(authState.user.uid);
        const peopleQuery = query(collRef, orderBy('name'));

        const unsubscribe = onSnapshot(peopleQuery, (snapshot) => {
            const data = snapshot.docs.map((doc => {
                return doc.data() as Person;
            }))

            setPeopleState({
                people: data,
                loading: false
            })
        }, (error) => {
            devError('Error fetching people. Error:', error);
            addToast({
                type: 'error',
                title: 'Error',
                message: 'Unable to load people.  Please check your connection and try again.',
                error: error as Error
            });
            setPeopleState({
                people: [],
                loading: false
            })
        })

        return () => unsubscribe();
    }, [authState.user?.uid]); // Not including addToast, because I don't want to restart the listener for any toast changes.

    const value = useMemo<PeopleState>(() => (
        peopleState
    ), [peopleState])

    return (
        <PeopleContext.Provider value={value}>
            {children}
        </PeopleContext.Provider>
    )
}