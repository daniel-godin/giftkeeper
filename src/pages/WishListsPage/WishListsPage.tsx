import { useState } from 'react';
import styles from './WishListsPage.module.css'
import { Link } from 'react-router';
import { AddWishListModal } from '../../components/modals/AddWishListModal/AddWishListModal';
import { useWishLists } from '../../contexts/WishListsProvider';

export function WishListsPage () {
    const { wishLists, loading: loadingWishLists  } = useWishLists();

    const [isAddWishListModalOpen, setIsAddWishListModalOpen] = useState<boolean>(false);

    return (
        <section className={styles.wishListsPage}>
            <h1>Wish Lists</h1>

            <button className={styles.addWishListButton} onClick={() => setIsAddWishListModalOpen(true)}>Add Wish List</button>

            <div className={styles.wishListsContainer}>
                {loadingWishLists ? (
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