import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './WishListsPage.module.css'
import { WishList } from '../../types/WishListType';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { Link } from 'react-router';
import { AddWishListModal } from '../../components/modals/AddWishListModal/AddWishListModal';

export function WishListsPage () {
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [wishLists, setWishLists] = useState<WishList[]>([]);

    const [isAddWishListModalOpen, setIsAddWishListModalOpen] = useState<boolean>(false);

    // Firestore onSnapshot Listener For: collection(db, 'users', {userId}, 'wishlists')
    useEffect(() => {
        // Guard Clause
        if (!authState.user) {
            setWishLists([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Firestore Queries
        const wishListsRef = collection(db, 'users', authState.user.uid, 'wishLists');
        const wishListsQuery = query(wishListsRef, orderBy('createdAt')); // Sorts by createdAt

        const unsubscribe = onSnapshot(wishListsQuery, (snapshot) => {
            const wishListsList: WishList[] = [];
            snapshot.forEach((doc) => {
                wishListsList.push(doc.data() as WishList);
            })
            setWishLists(wishListsList);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching wish lists:', error);
            setIsLoading(false);
        })

        return () => unsubscribe();
    }, [])

    return (
        <section className={styles.wishListsPage}>
            <h1>Wish Lists</h1>

            <button className={styles.addWishListButton} onClick={() => setIsAddWishListModalOpen(true)}>Add Wish List</button>

            <div className={styles.wishListsContainer}>
                {isLoading ? (
                    <div className={styles.loadingMessage}>Loading wish lists...</div>
                ) : (
                    <div className={styles.wishListsGrid}>
                        {wishLists.length === 0 ? (
                            <div>No wish lists added yet.  Create a Wish List to get started!</div>
                        ) : (
                            wishLists.map((wishList) => (
                                <Link to={`/wish-lists/${wishList.id}`} key={wishList.id} className={styles.wishListCard}>
                                    <div className={styles.wishListInfo}>
                                        <div className={styles.wishListTitle}>{wishList.title}</div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>  
                )}
            </div>

            <AddWishListModal
                isOpen={isAddWishListModalOpen}
                onClose={() => setIsAddWishListModalOpen(false)}
            />

        </section>
    )
}