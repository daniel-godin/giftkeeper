import { useParams } from 'react-router'
import styles from './PersonPage.module.css'
import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPersonDocument } from '../../firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { Person } from '../../types/PersonType';

export function PersonPage() {
    const { authState } = useAuth();
    const { personId } = useParams();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [person, setPerson] = useState<Person>({ name: '' });

    // State for managing changes to displayed data:
    const [formData, setFormData] = useState<Person>({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    

    // Setup a Firestore listener to doc(db, 'users', {userId}, 'people', {personId})
    useEffect(() => {
        // Guard Clauses:
        if (!authState.user || !personId) {
            console.warn('No user or personId found. Cannot fetch data.');
            return;
        }

        setIsLoading(true);

        const personDocRef = getPersonDocument(authState.user.uid, personId);
        const unsubscribe = onSnapshot(personDocRef, (snapshot) => {
            // Guard Clause
            if (!snapshot.exists()) {
                console.error('Person Document Not Found');
                setIsLoading(false);
                return;
            }

            const data = snapshot.data() as Person;
            setPerson(data);
            setFormData(data);
            setIsLoading(false);
        }, (error) => {
            console.error('Error setting up snapshot for person. Error:', error);
            setIsLoading(false);
        })
        
        return () => unsubscribe();
    }, []);

    // ***** USE EFFECT FOR TESTING PURPOSES. DELETE IN PROD *****
    useEffect(() => {
        console.log('Person Data:', person);
    }, [person])

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleDateInputChange = () => {
        console.log('test. handleDateInputChange triggered');
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('test. handleSubmit triggered.');
    }

    return (
        <section className={styles.personPage}>
            <form className={styles.personForm} onSubmit={handleSubmit} autoComplete='off'>
                {person.name ? ( <h3>{person.name}</h3> ) : ( <h3>Unknown Name</h3> )}

                <label className={styles.label}>Relationship
                    <input
                        className={styles.input}
                        type='text'
                        name='relationship'
                        required={false}
                        value={formData.relationship}
                        disabled={isSubmitting}
                        onChange={handleTextInputChange}
                    />
                </label>
                    
                <label className={styles.label}>Birthday
                    <input
                        className={styles.input}
                        type='date'
                        name='date'
                        required={false}
                        value={formData.birthday}
                        disabled={isSubmitting}
                        onChange={handleDateInputChange}
                    />
                </label>
            </form>

            <div className={styles.personDataContainer}>
                <div className={styles.boxesContainer}>
                    <div className={styles.box}>
                        {/* Days to Birthday -- Click to Change Birthday */}
                    </div>

                    <div className={styles.box}>
                        {/* Gift Ideas and/or Gift Lists*/}
                    </div>
                </div>

                <div className={styles.upcomingDatesContainer}>

                </div>

                <div className={styles.giftIntelligenceContainer}>

                </div>
            </div>
        </section>
    )
}