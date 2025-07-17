import { createContext, useContext, useEffect, useState } from "react";
import { GiftList } from "../types/GiftType";
import { useAuth } from "./AuthContext";
import { getGiftListsCollRef } from "../firebase/firestore";
import { onSnapshot, orderBy, query } from "firebase/firestore";

interface GiftListsState {
    giftLists: GiftList[];
    loading: boolean;
    error?: string;
}

const GiftListsContext = createContext<GiftListsState | undefined>(undefined);

export const useGiftLists = () => {
    const context = useContext(GiftListsContext);

    // Guard Clause
    if (context === undefined) { throw new Error('useGiftLists must be used within a GiftListsProvider'); };

    return context;
}

export function GiftListsProvider({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();

    const [giftListsState, setGiftListsState] = useState<GiftListsState>({
        giftLists: [],
        loading: true
    })

    useEffect(() => {
        // Guard Clause
        if (!authState.user) { 
            setGiftListsState({ giftLists: [], loading: false });
            return; 
        };

        const collRef = getGiftListsCollRef(authState.user.uid);
        const giftListsQuery = query(collRef, orderBy('updatedAt', 'desc'));

        const unsubscribe = onSnapshot(giftListsQuery, (snapshot) => {
            const data: GiftList[] = [];

            snapshot.forEach((doc) => {
                data.push(doc.data() as GiftList);
            })

            setGiftListsState({
                giftLists: data,
                loading: false
            })
        }, (error) => {
            console.error('Error fetching gift lists. Error:', error);
            setGiftListsState({
                giftLists: [],
                loading: false
            })
        })

        return () => unsubscribe();
    }, [authState.user?.uid]);

    return (
        <GiftListsContext.Provider value={giftListsState}>
            {children}
        </GiftListsContext.Provider>
    )
}