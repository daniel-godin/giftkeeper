import { useEffect, useState } from 'react'
import styles from './PeoplePage.module.css'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Person } from '../../types/PersonType';
import { AddPersonModal } from '../../components/modals/AddPersonModal/AddPersonModal';
import { Link } from 'react-router';

export function PeoplePage () {
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [people, setPeople] = useState<Person[]>([]);

    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);

    // Set up Firestore onSnapshot listener for collection(db, 'users', {userId}, 'people')
    useEffect(() => {
        // Guard Clause
        if (!authState.user) {
            setPeople([]);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);

        // Firestore Queries
        const peopleRef = collection(db, 'users', authState.user.uid, 'people');
        const peopleQuery = query(peopleRef, orderBy('name')); // Sorts by name

        const unsubscribe = onSnapshot(peopleQuery, (snapshot) => {
            const peopleList: Person[] = [];
            snapshot.forEach((doc) => {
                peopleList.push(doc.data() as Person);
            })
            setPeople(peopleList);
            setIsLoading(false);
        }, (error) => {
            console.error('Error fetching people:', error);
            setIsLoading(false);
        })

        return () => unsubscribe();
    }, [])

    return (
        <section className={styles.peoplePage}>
            <h1>People</h1>

            <button className={styles.addPersonButton} onClick={() => setIsAddPersonModalOpen(true)}>Add Person</button>

            <div className={styles.peopleContainer}>
                {isLoading ? (
                    <div className={styles.loadingMessage}>Loading people...</div>
                ) : (
                    <div className={styles.peopleGrid}>
                        {people.length === 0 ? (
                            <div>No people added yet.  Add someone to get get started!</div>
                        ) : (
                            people.map((person) => (
                                <Link to={`/people/${person.id}`} key={person.id} className={styles.personCard}>
                                    <div className={styles.avatar}></div>
                                    <div className={styles.personInfo}>
                                        <div className={styles.personName}>{person.name}</div>
                                        <div className={styles.personBirthday}>
                                            Birthday: {person.birthday ? (person.birthday) : (<span className={styles.noBirthdayText}>No birthday set</span>)}
                                        </div>
                                    </div>
                                </Link>
                            ))
                        )}
                    </div>  
                )}
            </div>

            <AddPersonModal
                isOpen={isAddPersonModalOpen}
                onClose={() => setIsAddPersonModalOpen(false)}
            />

        </section>
    )
}