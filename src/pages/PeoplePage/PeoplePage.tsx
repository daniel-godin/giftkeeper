import { FormEvent, useState } from 'react'
import styles from './PeoplePage.module.css'
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { Person } from '../../types/PersonType';

export function PeoplePage () {
    const { authState } = useAuth();

    const [newPerson, setNewPerson] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

        </section>
    )
}