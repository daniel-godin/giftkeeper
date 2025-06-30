import { useState } from 'react'
import styles from './PeoplePage.module.css'
import { AddPersonModal } from '../../components/modals/AddPersonModal/AddPersonModal';
import { Link } from 'react-router';
import { usePeople } from '../../contexts/PeopleContext';

export function PeoplePage () {
    const { people, loading: loadingPeople } = usePeople();

    const [isAddPersonModalOpen, setIsAddPersonModalOpen] = useState<boolean>(false);

    return (
        <section className={styles.peoplePage}>
            <h1>People</h1>

            <button className={styles.addPersonButton} onClick={() => setIsAddPersonModalOpen(true)}>Add Person</button>

            <div className={styles.peopleContainer}>
                {loadingPeople ? (
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