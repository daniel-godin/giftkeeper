import { Link, useParams } from 'react-router';
import styles from './WishListPage.module.css'
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { WishItem, WishList } from '../../types/WishListType';
import { getWishItemDocRef, getWishItemsCollRef, getWishListDocRef } from '../../firebase/firestore';
import { deleteDoc, doc, onSnapshot, serverTimestamp, setDoc, UpdateData, updateDoc } from 'firebase/firestore';
import { formatFirestoreDate } from '../../utils';
import { EditableTitle } from '../../components/ui/EditableTitle/EditableTitle';
import { Trash2, X } from 'lucide-react';
import { useWishLists } from '../../contexts/WishListsProvider';

export function WishListPage() {
    const { wishListId } = useParams();
    const { authState } = useAuth();
    const { wishLists, loading: wishListsLoading} = useWishLists();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [wishList, setWishList] = useState<WishList>({ title: '' });
    const [wishItems, setWishItems] = useState<WishItem[]>([]);

    // For adding a new item:
    const [newItem, setNewItem] = useState<WishItem>({ name: '' });
    const [isNewItemOpen, setIsNewItemOpen] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const newItemInputRef = useRef<HTMLInputElement>(null);

    // Grab Data for GiftListId from GiftLists data context array.
    useEffect(() => {
        if (!wishListId || !authState.user || wishListsLoading) { return } // Guard/Optimization Clause

        const wishListData = wishLists.find(wishList => wishList.id === wishListId);
        if (!wishListData) { return }; // Guard Clause -- If No Data Found, Exit.

        setWishList(wishListData);

        const collRef = getWishItemsCollRef(authState.user.uid, wishListId);
        const unsubscribe = onSnapshot(collRef, (snapshot) => {
            const items = snapshot.docs.map(doc => {
                const data = doc.data() as WishItem;
                return data;
            })

            setWishItems(items);
        }, (error) => {
            console.error('Error listening to wish items. Error:', error);
        })

        return () => unsubscribe();
    }, [wishListId, authState.user?.uid, wishLists, wishListsLoading])

    // Effect to "focus" into <input> when a user clicks the "add new item" button.
    useEffect(() => {
        if (isNewItemOpen && newItemInputRef.current) {
            newItemInputRef.current.focus();
        }
    }, [isNewItemOpen])

    const handleTitleSave = async (newTitle: string) => {
        if (!authState.user) { return; }
        if (!wishListId) { return; }

        try {
            const docRef = getWishListDocRef(authState.user.uid, wishListId);
            await updateDoc(docRef, {
                title: newTitle,
                updatedAt: serverTimestamp()
            })
        } catch (error) {
            console.error('Error updating title. Error:', error);
        }
    }

    const handlePurchasedCheckbox = async (item: WishItem) => {
        // Guard Clause
        if (!authState.user || !wishListId || !item.id) { return; };

        try {
            const docRef = getWishItemDocRef(authState.user.uid, wishListId, item.id);
            await updateDoc(docRef, {
                'purchased': !item.purchased, // boolean
                'updatedAt': serverTimestamp()
            })
        } catch (error) {
            console.error('Error changing purchased boolean. Error:', error);
        }
    }

    // Established Item Name Change
    const handleItemSave = async (e: React.ChangeEvent<HTMLInputElement> | React.KeyboardEvent<HTMLInputElement>, item: WishItem, fieldName: string) => {
        // Keyboard Event Clause:
        if (e.type === 'keydown' && (e as React.KeyboardEvent).key !== 'Enter') { return; } ;

        // Guard Clause
        if (!authState.user || !wishListId || !item.id) { return; };

        const newValue = (e.target as HTMLInputElement).value.trim();

        try {
            const docRef = getWishItemDocRef(authState.user.uid, wishListId, item.id);
            const newData: UpdateData<WishItem> = {
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

    const handleDeleteItem = async (item: WishItem) => {
        // Guard Clauses:
        if (!authState.user || !wishListId || !item.id) { return; };

        try {
            const docRef = getWishItemDocRef(authState.user.uid, wishListId, item.id);
            await deleteDoc(docRef);
        } catch (error) {
            console.error(`Error deleting Wish Item: ${item.id}. Error:`, error);
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

    // Creation of new item in WishList (WishItem)
    const handleNewItemSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Guard Clauses
        if (!authState.user) { return; };
        if (!wishListId) { return; };
        if (!newItem.name.trim()) { return; };

        setIsSubmitting(true);
        try {
            const newDocRef = doc(getWishItemsCollRef(authState.user.uid, wishListId)); // Using doc() gives me a random UUID.
            const newDocumentData: WishItem = {
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
        <section className={styles.wishListPage}>
            Loading...
        </section>
    )}

    return (
        <section className={styles.wishListPage}>
            <header className={styles.header}>
                <div className={styles.firstRowHeader}>
                    <Link to={`/wish-lists`} className={styles.backButton}>
                        ← Wish Lists
                    </Link>
                    {wishList.createdAt && (
                        <p>Created On: {formatFirestoreDate(wishList.createdAt, 'long')}</p>
                    )}
                </div>

                <div className={styles.secondRowHeader}>
                    {/* Possibly add a Ternary with a "Unknown Title" */}
                    {wishList.title && (
                        <EditableTitle
                            value={wishList.title}
                            onSave={handleTitleSave}
                            tagName='h2'
                        />
                    )}
                    {wishItems && (
                        <p>{wishItems.length} items</p>
                    )}
                </div>
            </header>

            <div className={styles.itemsSection}>
                <header className={styles.itemsSectionHeader}>
                    <h3>Wish Items:</h3>
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

                    {wishItems.length === 0 && (
                        <p>Add items to get started.</p>
                    )}

                    {wishItems.length > 0 && (
                        // Map through wishItems array and make a list
                        wishItems.map((item) => (
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