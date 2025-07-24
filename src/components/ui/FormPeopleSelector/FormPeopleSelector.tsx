import { useEffect, useRef, useState } from 'react';
import { Person } from '../../../types/PersonType';
import { FormCheckbox } from '../FormCheckbox/FormCheckbox';
import styles from './FormPeopleSelector.module.css'
import { FormInput } from '../FormInput/FormInput';
import { DEFAULT_PERSON } from '../../../constants/defaultObjects';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { getPeopleCollRef } from '../../../firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';

interface FormPeopleSelectorProps {
    legendText?: string;
    people?: Person[];
    selectedPeopleIds?: string[];
    disabled?: boolean;
    onChange: (personId: string, checked: boolean) => void;

    // For Creating a New "Person"
    allowCreateNewPerson?: boolean;
    onCreatePerson?: (personData: Person) => void;
}

export function FormPeopleSelector({
    legendText = 'Select People:',
    people = [],
    selectedPeopleIds = [],
    disabled = false,
    onChange,
    allowCreateNewPerson = false,
} : FormPeopleSelectorProps) {
    const { authState } = useAuth();

    const newPersonInputRef = useRef<HTMLInputElement>(null);

    const [isCreateNewPersonEnabled, setIsCreateNewPersonEnabled] = useState<boolean>(false);
    const [newPerson, setNewPerson] = useState<Person>(DEFAULT_PERSON);
    const [isCreatingNewPerson, setIsCreatingNewPerson] = useState<boolean>(false);

    useEffect(() => {
        if (isCreateNewPersonEnabled && newPersonInputRef.current) {
            newPersonInputRef.current.focus();
        }
    }, [isCreateNewPersonEnabled])

    const handleCreateNewPersonCheckbox = (isEnabled: boolean) => {
        setIsCreateNewPersonEnabled(!!isEnabled);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPerson(prev => ({
            ...prev,
            name: value
        }))
    }

    // This is needed when a user types in a new person name and hits "Enter". Otherwise will submit whole parent form.
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleCreateNewPerson();
        } 
    }

    const handleCreateNewPerson = async () => {

        if (!authState || !authState.user || !authState.user.uid || !newPerson.name.trim()) { return }; // Guard

        setIsCreatingNewPerson(true);

        try {
            const newDocRef = doc(getPeopleCollRef(authState.user.uid));
            const newDocData: Person = {
                ...newPerson,
                id: newDocRef.id,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newDocData);

            setIsCreateNewPersonEnabled(false);
            setNewPerson(DEFAULT_PERSON);
            setIsCreatingNewPerson(false);

        } catch (error) {
            console.error('Error creating new person. Error:', error);
            setIsCreatingNewPerson(false);
        }
    }

    return (
        <fieldset className={styles.fieldset}>
            <legend className={styles.legend}>{legendText}</legend>

            {people.map(person => (
                <FormCheckbox
                    key={person.id}
                    label={person.name}
                    name={person.id}
                    checked={selectedPeopleIds.includes(person.id || '')}
                    disabled={disabled}
                    onChange={(checked) => onChange(person.id || '', checked)}
                />
            ))}

            {allowCreateNewPerson && (
                <FormCheckbox
                    label='+ Create New Person'
                    checked={isCreateNewPersonEnabled}
                    onChange={handleCreateNewPersonCheckbox}
                />
            )}

            {allowCreateNewPerson && isCreateNewPersonEnabled && (
                <fieldset className={styles.createNewPersonFieldset}>
                    <legend>Create New Person</legend>
                    <FormInput
                        ref={newPersonInputRef}
                        type='text'
                        name='newPersonName'
                        disabled={isCreatingNewPerson}
                        value={newPerson.name}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                    />
                    <button 
                        type='button' 
                        disabled={isCreatingNewPerson}
                        className={styles.createNewPersonButton}
                        onClick={handleCreateNewPerson}
                    >
                        Create Person
                    </button>
                </fieldset>
            )}
        </fieldset>
    )
}