import { useEffect } from 'react';
import styles from './EventPage.module.css'
import { useParams } from 'react-router';

export function EventPage() {
    const { eventId } = useParams();

    // Setup a Firestore listener to doc(db, 'users', {userId}, 'events', {eventId})

    useEffect(() => {
        console.log("Event ID:", eventId);
    }, [eventId])

    return (
        <>EventPage</>
    )
}