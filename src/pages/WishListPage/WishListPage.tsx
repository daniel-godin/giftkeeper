import { useParams } from 'react-router';
import styles from './WishListPage.module.css'
import { useEffect } from 'react';

export function WishListPage() {
    const { wishListId } = useParams();

    // Setup a Firestore listener to doc(db, 'users', {userId}, 'giftLists', {giftListId})

    useEffect(() => {
        console.log("Wish List ID:", wishListId);
    }, [wishListId])

    return (
        <>WishListPage</>
    )
}