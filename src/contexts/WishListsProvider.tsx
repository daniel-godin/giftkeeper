import { createContext, useContext, useEffect, useState } from "react";
import { WishList } from "../types/WishListType";
import { useAuth } from "./AuthContext";
import { getWishListsCollection } from "../firebase/firestore";
import { onSnapshot, orderBy, query } from "firebase/firestore";


interface WishListsState {
    wishLists: WishList[];
    loading: boolean;
    error?: string;
}

const WishListsContext = createContext<WishListsState | undefined>(undefined);

export const useWishLists = () => {
    const context = useContext(WishListsContext);

    // Guard Clause
    if (context === undefined) { throw new Error('useWishLists must be used within a WishListsProvider'); };

    return context;
}

export function WishListsProvider({ children } : { children: React.ReactNode }) {
    const { authState } = useAuth();

    const [wishListsState, setWishListsState] = useState<WishListsState>({
        wishLists: [],
        loading: true
    })

    useEffect(() => {
        // Guard Clause
        if (!authState.user) { 
            setWishListsState({ wishLists: [], loading: false });
            return; 
        };

        const collRef = getWishListsCollection(authState.user.uid);
        const wishListsQuery = query(collRef, orderBy('createdAt'));

        const unsubscribe = onSnapshot(wishListsQuery, (snapshot) => {
            const data: WishList[] = [];

            snapshot.forEach((doc) => {
                data.push(doc.data() as WishList);
            })

            setWishListsState({
                wishLists: data,
                loading: false
            })
        }, (error) => {
            console.error('Error fetching wish lists. Error:', error);
            setWishListsState({
                wishLists: [],
                loading: false
            })
        })

        return () => unsubscribe();
    }, [authState.user?.uid]);

    return (
        <WishListsContext.Provider value={wishListsState}>
            {children}
        </WishListsContext.Provider>
    )
}