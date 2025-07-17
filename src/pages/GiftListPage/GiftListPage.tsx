import { Link, useParams } from 'react-router';
import styles from './GiftListPage.module.css'
import { useEffect, useState } from 'react';
import { GiftItem, GiftList } from '../../types/GiftType';
import { useAuth } from '../../contexts/AuthContext';
import { onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { formatFirestoreDate } from '../../utils';
import { EditableTitle } from '../../components/ui/EditableTitle/EditableTitle';
import { getPersonGiftItemsCollRef, getGiftListDocRef } from '../../firebase/firestore';
import { GiftItemCard } from '../../components/GiftItemCard/GiftItemCard';
import { useGiftLists } from '../../contexts/GiftListsProvider';

export function GiftListPage() {
    const { giftListId } = useParams();
    const { authState } = useAuth();
    const { giftLists, loading: giftListsLoading } = useGiftLists();

    const [giftList, setGiftList] = useState<GiftList>({ title: '', personId: '' });
    const [giftItems, setGiftItems] = useState<GiftItem[]>([]);

    // Grab Data for GiftListId from GiftLists data context array.
    useEffect(() => {
        if (!giftListId || !authState.user || giftListsLoading) { return } // Guard/Optimization Clause.

        const giftListData = giftLists.find(giftList => giftList.id === giftListId);
        if (!giftListData) { return }; // Guard Clause -- If No Data Found Exit Out

        setGiftList(giftListData);

        const collRef = getPersonGiftItemsCollRef(authState.user.uid, giftListId);
        const unsubscribe = onSnapshot(collRef, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data() as GiftItem;
                return data;
            })

            setGiftItems(items);
        }, (error) => {
            console.error('Error listening to gift items. Error:', error);
        })

        return () => unsubscribe();
    }, [giftListId, authState.user?.uid, giftLists, giftListsLoading])

    const handleTitleSave = async (newTitle: string) => {
        if (!authState.user) { return; }
        if (!giftListId) { return; }

        try {
            const giftListRef = getGiftListDocRef(authState.user.uid, giftListId);
            await updateDoc(giftListRef, {
                title: newTitle,
                updatedAt: serverTimestamp()
            })
        } catch (error) {
            console.error('Error updating title. Error:', error);
        }
    }

    if (giftListsLoading) { return (
        <section className={styles.giftListPage}>
            Loading Gift List...
        </section>
    )}

    return (
        <section className={styles.giftListPage}>
            <header className={styles.header}>
                <div className={styles.firstRowHeader}>
                    <Link to={`/gift-lists`} className={styles.backButton}>
                        ← Gift Lists
                    </Link>
                    {giftList.createdAt && (
                        <p>Created On: {formatFirestoreDate(giftList.createdAt, 'long')}</p>
                    )}
                </div>

                <div className={styles.secondRowHeader}>
                    {/* Possibly add a Ternary with a "Unknown Title" */}
                    {giftList.title && (
                        <EditableTitle
                            value={giftList.title}
                            onSave={handleTitleSave}
                            tagName='h2'
                        />
                    )}
                    {giftItems && (
                        <p>{giftItems.length} items</p>
                    )}
                </div>
            </header>

            <div className={styles.itemsSection}>
                <header className={styles.itemsSectionHeader}>
                    <h3>Gift Ideas</h3>
                </header>

                <div className={styles.itemsList}>
                    {giftItems.length === 0 && (
                        <p>Add items to get started.</p>
                    )}

                    {giftItems.length > 0 && (
                        // Map through giftItems array and make a list
                        giftItems.map((item) => (
                            <GiftItemCard
                                key={item.id}
                                item={item}
                                giftListId={giftListId || ''}
                            />
                        ))
                    )}

                </div>
            </div>
        </section>
    )
}