import { useEffect } from 'react';
import styles from './EventPage.module.css'
import { useParams } from 'react-router';
import { collectionGroup, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

export function EventPage() {
    const { eventId } = useParams();

    // Setup a Firestore listener to doc(db, 'users', {userId}, 'events', {eventId})

    useEffect(() => {
        console.log("Event ID:", eventId);

        // TEST:  Try out collection group queries here:
        const testCollGroupQueries = async () => {
            console.log('testCollGroupQueries triggered');

            const queryCollectionGroupQuery = query(collectionGroup(db, 'giftItems'), where('eventId', '==', eventId))
            const querySnapshot = await getDocs(queryCollectionGroupQuery);
            querySnapshot.forEach((doc) => {
                console.log(doc.id, ' => ', doc.data());
            })
        }

        testCollGroupQueries();
    }, [eventId])

    return (
        <>EventPage</>
    )
}