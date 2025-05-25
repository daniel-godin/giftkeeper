import { useParams } from 'react-router';
import styles from './GiftListPage.module.css'
import { useEffect } from 'react';

export function GiftListPage() {
    const { giftListId } = useParams();

    // Setup a Firestore listener to doc(db, 'users', {userId}, 'giftLists', {giftListId})

    useEffect(() => {
        console.log("Gift List ID:", giftListId);
    }, [giftListId])

    return (
        <>GiftListPage</>
    )
}