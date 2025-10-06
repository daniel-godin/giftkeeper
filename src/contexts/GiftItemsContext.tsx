import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { onSnapshot, orderBy, query } from "firebase/firestore";
import { getGiftItemsCollRef } from "../firebase/firestore";
import { useAuth } from "./AuthContext";
import { GiftItem } from "../types/GiftType";
import { useToast } from "./ToastContext";
import { devError } from "../utils/logger";

interface GiftItemsState {
    giftItems: GiftItem[];
    loading: boolean;
}

const GiftItemsContext = createContext<GiftItemsState | undefined>(undefined);

// Hook for easy access to gift item data throughout the codebase, without using useContext everywhere.
export const useGiftItems = () => {
    const context = useContext(GiftItemsContext);
    if (context === undefined) { throw new Error('useGiftItems must be used within a GiftItemsProvider'); };
    return context;
}

export function GiftItemsProvider({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();
    const { addToast } = useToast();

    const [giftItemsState, setGiftItemsState] = useState<GiftItemsState>({
        giftItems: [],
        loading: true
    })

    useEffect(() => {
        // Guard Clause
        if (!authState.user) { 
            setGiftItemsState({ giftItems: [], loading: false });
            return; 
        };

        const collRef = getGiftItemsCollRef(authState.user.uid);
        const giftItemsQuery = query(collRef, orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(giftItemsQuery, (snapshot) => {
            const data: GiftItem[] = snapshot.docs.map((doc => {
                return doc.data() as GiftItem;
            }))

            setGiftItemsState({
                giftItems: data,
                loading: false
            })

        }, (error) => {
            devError('Error fetching gift items. Error:', error);

            addToast({
                type: 'error',
                title: 'Error',
                message: 'Unable to fetch gift items.  Please check your connection and try again.',
                error: error as Error
            })
            
            setGiftItemsState({
                giftItems: [],
                loading: false
            })
        })

        return () => unsubscribe();
    }, [authState.user?.uid]);  // Not including addToast, because I don't want to restart the listener for any toast changes.

    const value = useMemo<GiftItemsState>(() => (
        giftItemsState
    ), [giftItemsState])

    return (
        <GiftItemsContext.Provider value={value}>
            {children}
        </GiftItemsContext.Provider>
    )
}