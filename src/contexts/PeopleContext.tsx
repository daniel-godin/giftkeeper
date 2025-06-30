import { createContext, useContext, useEffect, useState } from "react";
import { Person } from "../types/PersonType";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { getPeopleCollRef } from "../firebase/firestore";
import { useAuth } from "./AuthContext";

interface PeopleState {
    people: Person[];
    loading: boolean;
    error?: string;
}

const PeopleContext = createContext<PeopleState | undefined>(undefined);

export const usePeople = () => {
    const context = useContext(PeopleContext);

    // Guard Clause
    if (context === undefined) { throw new Error('usePeople must be used within a PeopleProvider'); };

    return context;
}

export function PeopleProvider({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();

    const [peopleState, setPeopleState] = useState<PeopleState>({
        people: [],
        loading: true
    })

    useEffect(() => {
        // Guard Clause
        if (!authState.user) { 
            setPeopleState({ people: [], loading: false });
            return; 
        };

        const collRef = getPeopleCollRef(authState.user.uid);
        const peopleQuery = query(collRef, orderBy('name'));

        const unsubscribe = onSnapshot(peopleQuery, (snapshot) => {
            const data: Person[] = [];

            snapshot.forEach((doc) => {
                data.push(doc.data() as Person);
            })

            setPeopleState({
                people: data,
                loading: false
            })
        }, (error) => {
            console.error('Error fetching people. Error:', error);
            setPeopleState({
                people: [],
                loading: false
            })
        })

        return () => unsubscribe();
    }, [authState.user?.uid]);

    return (
        <PeopleContext.Provider value={peopleState}>
            {children}
        </PeopleContext.Provider>
    )
}