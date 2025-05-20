import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import styles from './WishListsPage.module.css'
import { WishList } from '../../types/WishListType';
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export function WishListsPage () {
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [wishLists, setWishLists] = useState<WishList[]>([]);

    const [newWishList, setNewWishList] = useState({ title: '' })
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setNewWishList({
            ...newWishList,
            [name]: value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guard Clauses:
        if (!newWishList || !newWishList.title) { console.warn('Must include title'); return; };
        if (!authState.user) { return; };

        setIsSubmitting(true);
        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'wishLists'))
            const newWishListObject: WishList = {
                id: newDocRef.id,
                title: newWishList.title,

                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newWishListObject);

            console.log(`New Gift List (${newWishList.title}) created.`)
            setNewWishList({ title: '' });

        } catch (error) {
            console.error('Error submitting new wish list. Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <section className={styles.wishListsPage}>
            <h1>Wish Lists</h1>

            <form className={styles.formCreateWishList} onSubmit={handleSubmit} autoComplete='off'>
                <label className={styles.label}>Wish List Title:
                    <input
                        type='text'
                        name='title'
                        required={true}
                        value={newWishList.title}
                        onChange={handleInputChange}
                    />
                </label>

                <button className={styles.button}>{isSubmitting ? (<>Creating New Wish List...</>) : (<>Create New Wish List</>)}</button>
            </form>

            <div className={styles.wishListsContainer}>
                {isLoading ? (
                    <div className={styles.loadingMessage}>Loading wish lists...</div>
                ) : (
                    <div className={styles.wishListsGrid}>
                        {wishLists.length === 0 ? (
                            <div>No wish lists added yet.  Create a Wish List to get started!</div>
                        ) : (
                            wishLists.map((wishList) => (
                                <div key={wishList.id} className={styles.wishListCard}>
                                    {wishList.title}
                                </div>
                            ))
                        )}
                    </div>  
                )}
            </div>
        </section>
    )
}