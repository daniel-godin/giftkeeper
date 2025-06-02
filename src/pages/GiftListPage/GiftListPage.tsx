import { Link, useParams } from 'react-router';
import styles from './GiftListPage.module.css'
import { useEffect, useRef, useState } from 'react';
import { GiftItem, GiftList } from '../../types/GiftListType';
import { useAuth } from '../../contexts/AuthContext';
import { deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc, UpdateData, updateDoc } from 'firebase/firestore';
import { formatFirestoreDate } from '../../utils';
import { EditableTitle } from '../../components/ui/EditableTitle/EditableTitle';
import { Trash2, X } from 'lucide-react';
import { getGiftItemDoc, getGiftItemsCollection, getGiftListDoc } from '../../firebase/firestore';

export function GiftListPage() {
    const { giftListId } = useParams();
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [giftList, setGiftList] = useState<GiftList>({ title: '' });
    const [giftItems, setGiftItems] = useState<GiftItem[]>([]);

    // For adding a new item:
    const [newItem, setNewItem] = useState<GiftItem>({ name: '' });
    const [isNewItemOpen, setIsNewItemOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const newItemInputRef = useRef<HTMLInputElement>(null);

    // Gift List Listener:  Firestore onSnapshot Document Listener: // doc(db, 'users', {userId}, 'giftLists', {giftListId})
    useEffect(() => {
        // Might need to put a re-direct or something to make sure unauthorized access doesn't happen.

        // Guard Clauses:
        if (!authState.user) {
            setIsLoading(false);
            return;
        }

        if (!giftListId) { 
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // const giftListRef = doc(db, 'users', authState.user.uid, 'giftLists', giftListId);
        const giftListRef = getGiftListDoc(authState.user.uid, giftListId)
        const unsubscribe = onSnapshot(giftListRef, (snapshot) => {
            // Guard Clause
            if (!snapshot.exists()) {
                setIsLoading(false);
                console.error('Gift List Not Found');
                return;
            }

            const data = snapshot.data() as GiftList;
            setGiftList(data);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching gift list. Error:', error);
            setIsLoading(false);
        })

        return () => unsubscribe();
    }, []);

    // Gift Items Listener: Firestore onSnapshot Collection Listener: collection(db, 'users', {userId}, 'giftLists', {giftListId}, 'items') // Unsure about "items" as a sub-coll name.
    useEffect(() => {
        // Guard Clauses:
        if (!authState.user) {
            setIsLoading(false);
            return;
        }

        if (!giftListId) { 
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // const giftListItemsCollRef = collection(db, 'users', authState.user.uid, 'giftLists', giftListId, 'items');
        const giftListItemsCollRef = getGiftItemsCollection(authState.user.uid, giftListId);
        const giftItemsQuery = query(giftListItemsCollRef, orderBy('createdAt', 'desc'))
        const unsubscribe = onSnapshot(giftItemsQuery, (snapshot) => {
            const data:GiftItem[] = [];
            snapshot.forEach((doc) => {
                data.push(doc.data() as GiftItem);
            })
            setGiftItems(data);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching gift items. Error:', error);
            setIsLoading(false);
        })

        return () => unsubscribe();
    }, [])

    // Effect to "focus" into <input> when a user clicks the "add new item" button.
    useEffect(() => {
        if (isNewItemOpen && newItemInputRef.current) {
            newItemInputRef.current.focus();
        }
    }, [isNewItemOpen])

    const handleTitleSave = async (newTitle: string) => {
        if (!authState.user) { return; }
        if (!giftListId) { return; }

        try {
            // const giftListRef = doc(db, 'users', authState.user.uid, 'giftLists', giftListId);
            const giftListRef = getGiftListDoc(authState.user.uid, giftListId);
            await updateDoc(giftListRef, {
                title: newTitle,
                updatedAt: serverTimestamp()
            })
        } catch (error) {
            console.error('Error updating title. Error:', error);
        }
    }

    const handlePurchasedCheckbox = async (item: GiftItem) => {
        // Guard Clause
        if (!authState.user || !giftListId || !item.id) { return; };

        try {
            const docRef = getGiftItemDoc(authState.user.uid, giftListId, item.id);
            await updateDoc(docRef, {
                'purchased': !item.purchased, // boolean
                'updatedAt': serverTimestamp()
            })
        } catch (error) {
            console.error('Error changing purchased boolean. Error:', error);
        }
    }

    // Established Item Name Change
    const handleItemSave = async (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, item: GiftItem, fieldName: string) => {
        // Keyboard Event Clause:
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') { return; } ;

        // Guard Clause
        if (!authState.user || !giftListId || !item.id) { return; };

        const newValue = (e.target as HTMLInputElement).value.trim();

        try {
            // const docRef = doc(db, 'users', authState.user.uid, 'giftLists', giftListId, 'items', item.id);
            const docRef = getGiftItemDoc(authState.user.uid, giftListId, item.id);
            const newData: UpdateData<GiftItem> = {
                [fieldName]: newValue,
                updatedAt: serverTimestamp()
            }

            await updateDoc(docRef, newData)

            // Remove focus after Enter
            if (e.type === 'keydown') { (e.target as HTMLInputElement).blur(); }

        } catch (error) {
            console.error('Error saving item. Error:', error);
        }
    }

    const handleDeleteItem = async (item: GiftItem) => {
        // Guard Clauses:
        if (!authState.user || !giftListId || !item.id) { return; };

        try {
            // const docRef = doc(db, 'users', authState.user?.uid, 'giftLists', giftListId, 'items', item.id);
            const docRef = getGiftItemDoc(authState.user.uid, giftListId, item.id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting Gift Item: ${item.id}. Error:`, error);
        }
    }

    // Toggle in <header> to open/close new item box.
    const handleNewItemToggle = () => { setIsNewItemOpen(!isNewItemOpen); };

    const handleNewItemTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewItem({
            ...newItem,
            name: e.target.value
        });
    }

    // Creation of new item in GiftList (GiftItem)
    const handleNewItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guard Clauses
        if (!authState.user) { return; };
        if (!giftListId) { return; };
        if (!newItem.name.trim()) { return; };

        setIsSubmitting(true);
        try {
            // const newDocRef = doc(collection(db, 'users', authState.user.uid, 'giftLists', giftListId, 'items'))
            const newDocRef = doc(getGiftItemsCollection(authState.user.uid, giftListId)); // Using doc() gives me a random UUID.
            const newDocumentData: GiftItem = {
                id: newDocRef.id,
                name: newItem.name,
                purchased: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newDocumentData);

            setIsNewItemOpen(false);
            setNewItem({name: ''})
        } catch (error) {
            console.error('Error submitting new item. Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) { return (
        <section className={styles.giftListPage}>
            Loading...
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
                    <button className={styles.toggleButton} onClick={handleNewItemToggle}>+ Add Item</button>
                </header>

                <div className={styles.itemsList}>
                    {isNewItemOpen && (
                        <form className={`${styles.itemContainer} ${styles.addItemForm}`} autoComplete='off' onSubmit={handleNewItemSubmit}>
                            <button className={styles.escapeButton} onClick={() => setIsNewItemOpen(false)} type='button'>
                                <X color='red' />
                            </button>
                            <input 
                                type='text' 
                                name='newItem'
                                ref={newItemInputRef}
                                onChange={handleNewItemTextChange}
                                value={newItem.name}
                                className={`${styles.inputText} ${styles.inputNewItem}`} 
                            />
                            <button className={styles.addItemButton}>Add Item</button>
                        </form>
                    )}

                    {giftItems.length === 0 && (
                        <p>Add items to get started.</p>
                    )}

                    {giftItems.length > 0 && (
                        // Map through giftItems array and make a list
                        giftItems.map((item) => (
                            <div key={item.id} className={styles.itemContainer}>
                                <input 
                                    type='checkbox'
                                    checked={item.purchased || false}
                                    onChange={() => handlePurchasedCheckbox(item)}
                                    className={styles.checkbox} 
                                />
                                <input 
                                    type='text'
                                    defaultValue={item.name}
                                    onBlur={(e) => handleItemSave(e, item, 'name')}
                                    onKeyDown={(e) => handleItemSave(e, item, 'name')}
                                    className={`
                                        ${styles.inputText}
                                        ${item.purchased ? styles.purchased : ''}
                                        `} 
                                    />
                                <button
                                    className={styles.deleteItemButton}
                                    onClick={() => { handleDeleteItem(item); } }
                                >
                                    <Trash2 color='red'/>
                                </button>
                            </div>
                        ))
                    )}

                </div>
            </div>
        </section>
    )
}