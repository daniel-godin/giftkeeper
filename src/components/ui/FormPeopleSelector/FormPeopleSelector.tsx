import { useState } from 'react';
import { Person } from '../../../types/PersonType';
import { FormCheckbox } from '../FormCheckbox/FormCheckbox';
import styles from './FormPeopleSelector.module.css'
import { FormInput } from '../FormInput/FormInput';

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
    onCreatePerson
} : FormPeopleSelectorProps) {

    const [isCreateNewPersonEnabled, setIsCreateNewPersonEnabled] = useState<boolean>(false);

    const [newPersonName, setNewPersonName] = useState<string>('');


    const handleCreateNewPersonCheckbox = (isEnabled: boolean) => {
        console.log('handleCreateNewPersonCheckbox triggered', )

        setIsCreateNewPersonEnabled(!!isEnabled);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setNewPersonName(value)
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
                <FormInput
                    type='text'
                    name='newPersonName'
                    disabled={disabled}
                    value={newPersonName}
                    onChange={handleInputChange}

                />
            )}
        </fieldset>
    )
}