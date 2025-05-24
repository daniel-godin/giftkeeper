import { useParams } from 'react-router'
import styles from './PersonPage.module.css'
import { useEffect } from 'react';

export function PersonPage() {
    const { personId } = useParams();

    // Setup a Firestore listener to doc(db, 'users', {userId}, 'people', {personId})

    useEffect(() => {
        console.log("Person ID:", personId);
    }, [personId])

    return (
        <>PersonPage</>
    )
}