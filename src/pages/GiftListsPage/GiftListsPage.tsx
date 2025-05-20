import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import styles from './GiftListsPage.module.css'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { GiftList } from '../../types/GiftListType';

export function GiftListsPage () {
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [giftLists, setGiftLists] = useState<GiftList[]>([]);

    const [newGiftList, setNewGiftList] = useState({title: ''})
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        // Guard Clause
        if (!authState.user) {
            setGiftLists([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Firestore Queries
        const giftListsRef = collection(db, 'users', authState.user.uid, 'giftLists');
        const giftListsQuery = query(giftListsRef, orderBy('createdAt')); // Sorts by createdAt

        const unsubscribe = onSnapshot(giftListsQuery, (snapshot) => {
            const giftListsList: GiftList[] = [];
            snapshot.forEach((doc) => {
                giftListsList.push(doc.data() as GiftList);
            })
            setGiftLists(giftListsList);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching gift lists:', error);
            setIsLoading(false);
        })

        return () => unsubscribe();
    }, [])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        setNewGiftList({
            ...newGiftList,
            [name]: value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guard Clauses:
        if (!newGiftList || !newGiftList.title) { console.warn('Must include title'); return; };
        if (!authState.user) { return; };

        setIsSubmitting(true);
        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'giftLists'))
            const newGiftListObject: GiftList = {
                id: newDocRef.id,
                title: newGiftList.title,

                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newGiftListObject);

            console.log(`New Gift List (${newGiftList.title}) created.`)
            setNewGiftList({ title: '' });

        } catch (error) {
            console.error('Error submitting new gift list. Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className={styles.giftListsPage}>
            <h1>Gift Lists</h1>

            <form className={styles.formCreateGiftList} onSubmit={handleSubmit} autoComplete='off'>
                <label className={styles.label}>Gift List Title:
                    <input
                        type='text'
                        name='title'
                        required={true}
                        value={newGiftList.title}
                        onChange={handleInputChange}
                    />
                </label>

                <button className={styles.button}>{isSubmitting ? (<>Creating New Gift List...</>) : (<>Create New Gift List</>)}</button>
            </form>

            <div className={styles.giftListsContainer}>
                {isLoading ? (
                    <div className={styles.loadingMessage}>Loading gift lists...</div>
                ) : (
                    <div className={styles.giftListsGrid}>
                        {giftLists.length === 0 ? (
                            <div>No gift lists added yet.  Create a Gift List to get started!</div>
                        ) : (
                            giftLists.map((giftList) => (
                                <div key={giftList.id} className={styles.giftListCard}>
                                    {giftList.title}
                                </div>
                            ))
                        )}
                    </div>  
                )}
            </div>
        </section>
    )
}