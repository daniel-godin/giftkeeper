import { useState } from 'react';
import styles from './GiftListsPage.module.css'
import { Link } from 'react-router';
import { AddGiftListModal } from '../../components/modals/AddGiftListModal/AddGiftListModal';
import { useGiftLists } from '../../contexts/GiftListsProvider';

export function GiftListsPage () {
    const { giftLists, loading: loadingGiftLists } = useGiftLists();

    const [isAddGiftListModalOpen, setIsAddGiftListModalOpen] = useState<boolean>(false);

    return (
        <section className={styles.giftListsPage}>
            <h1>Gift Lists</h1>

            <div className={styles.giftListsContainer}>
                {loadingGiftLists ? (
                    <div className={styles.loadingMessage}>Loading gift lists...</div>
                ) : (
                    <div className={styles.giftListsGrid}>
                        {giftLists.length === 0 ? (
                            <div>No gift lists added yet.  Create a Gift List to get started!</div>
                        ) : (
                            giftLists.map((giftList) => (
                                <Link to={`/gift-lists/${giftList.id}`} key={giftList.id} className={styles.giftListCard}>
                                    <div className={styles.giftListInfo}>
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