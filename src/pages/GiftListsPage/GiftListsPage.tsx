import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'
import styles from './GiftListsPage.module.css'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { GiftList } from '../../types/GiftListType';
import { Link } from 'react-router';
import { AddGiftListModal } from '../../components/modals/AddGiftListModal/AddGiftListModal';

export function GiftListsPage () {
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [giftLists, setGiftLists] = useState<GiftList[]>([]);

    const [isAddGiftListModalOpen, setIsAddGiftListModalOpen] = useState<boolean>(false);

    // Firestore onSnapshot Listener For: collection(db, 'users', {userId}, 'giftLists')
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

    return (
        <section className={styles.giftListsPage}>
            <h1>Gift Lists</h1>

            <button className={styles.addGiftListButton} onClick={() => setIsAddGiftListModalOpen(true)}>Add Gift List</button>

            <div className={styles.giftListsContainer}>
                {isLoading ? (
                    <div className={styles.loadingMessage}>Loading gift lists...</div>
                ) : (
                    <div className={styles.giftListsGrid}>
                        {giftLists.length === 0 ? (
                            <div>No gift lists added yet.  Create a Gift List to get started!</div>
                        ) : (
                            giftLists.map((giftList) => (
                                <Link to={`/gift-lists/${giftList.id}`} key={giftList.id} className={styles.giftListCard}>
                                    <div className={styles.personInfo}>
                                        <div className={styles.giftListTitle}>{giftList.title}</div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>  
                )}
            </div>

            <AddGiftListModal
                isOpen={isAddGiftListModalOpen}
                onClose={() => setIsAddGiftListModalOpen(false)}
            />
            
        </section>
    )
}