import { createContext, useContext, useEffect, useState } from "react";
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

export const useGiftItems = () => {
    const context = useContext(GiftItemsContext);

    // Guard Clause
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
            const data: GiftItem[] = [];

            snapshot.forEach((doc) => {
                data.push(doc.data() as GiftItem);
            })

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
    }, [authState.user?.uid]);

    return (
        <GiftItemsContext.Provider value={giftItemsState}>
            {children}
        </GiftItemsContext.Provider>
    )
}