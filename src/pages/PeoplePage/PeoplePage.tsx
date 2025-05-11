import { FormEvent, useEffect, useState } from 'react'
import styles from './PeoplePage.module.css'
import { collection, doc, onSnapshot, orderBy, query, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Person } from '../../types/PersonType';

export function PeoplePage () {
    const { authState } = useAuth();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [people, setPeople] = useState<Person[]>([]);

    const [newPerson, setNewPerson] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

    useEffect(() => {
        console.log(people);
    }, [people])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPerson(e.target.value);
    }

    const handleNewPersonForm = async (e: FormEvent) => {
        e.preventDefault();
        
        // Guard Clauses.  If empty, return;  Add error message later when you create the modal.
        if (!newPerson.trim()) { return; };
        if (!authState.user) { return; };

        setIsSubmitting(true);
        try {
            const newDocRef = doc(collection(db, 'users', authState.user.uid, 'people'));
            const personObject: Person = {
                id: newDocRef.id,
                name: newPerson.trim(),
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, personObject);

            console.log(`Person (${personObject.name}) created with ID: ${newDocRef.id}`)
            setNewPerson('');
        } catch (error) {
            console.error('Error creating new person. Error:', error);
        } finally {
            setIsSubmitting(false);
        }
    }


    return (
        <section className={styles.peoplePage}>
            <h1>People</h1>

            <form className={styles.formCreatePerson} onSubmit={handleNewPersonForm}>
                <input
                    type='text'
                    id='newPerson'
                    name='newPerson'
                    value={newPerson}
                    onChange={handleInputChange}
                    className={styles.textInput}
                />
                <button className={styles.submitButton}>{isSubmitting ? (<>Creating New Person...</>) : (<>Create New Person</>)}</button>
            </form>

            <div className={styles.peopleContainer}>
                {isLoading ? (
                    <div className={styles.loadingMessage}>Loading people...</div>
                ) : (
                    <div className={styles.peopleGrid}>
                        {people.length === 0 ? (
                            <div>No people added yet.  Add someone to get get started!</div>
                        ) : (
                            people.map((person) => (
                                <div key={person.id} className={styles.personCard}>
                                    {person.name}
                                </div>
                            ))
                        )}
                    </div>  
                )}
            </div>

        </section>
    )
}