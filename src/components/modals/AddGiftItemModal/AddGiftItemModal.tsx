import styles from './AddGiftItemModal.module.css';
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { GiftItem } from "../../../types/GiftListType";
import { BaseModal } from "../BaseModal/BaseModal";
import { X } from 'lucide-react';
import { getGiftItemsCollRef } from '../../../firebase/firestore';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { usePeople } from '../../../contexts/PeopleContext';
import { useUpcomingEvents } from '../../../hooks/useUpcomingEvents';
import { Event } from '../../../types/EventType';


interface AddGiftItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const defaultFormValues: GiftItem = {
    id: '',
    name: '',
    personId: '',
    personName: '',
    giftListId: '',
    status: 'idea',
    eventId: '',
    estimatedCost: 0,
    purchasedCost: 0,
}

export function AddGiftItemModal({ isOpen, onClose } : AddGiftItemModalProps) {
    const { authState } = useAuth();
    const { people } = usePeople();
    const upcomingEvents = useUpcomingEvents();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<GiftItem>(defaultFormValues);
    const [eventOptions, setEventOptions] = useState<Event[]>([]); // Should I put the default as "upcomingEvents" would that work?
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen) {
            setFormData(defaultFormValues)
            setStatus('');
        }
    }, [isOpen]);

    // FOR TESTING PURPOSES. TODO: DELETE THIS BEFORE PUSHING TO PROD
    useEffect(() => {
        console.log('Form Data:', formData);
    }, [formData])

    const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handlePersonDropdownInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const person = people.find(person => person.id === e.target.value);

        if (!person) { return }; // Guard/Optimization Clause
        
        setFormData({
            ...formData,
            personId: person.id,
            personName: person.name,
            giftListId: person.giftListId
        })
    }

    const handleStatusDropdownInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const {name, value} = e.target;
        setFormData({
            ...formData,
            [name]: value
        })

        setEventOptions(upcomingEvents);
    }

    const handleEventDropdownInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: Number(value.trim()) * 100, // Convert to number & multiply by 100 to get 'cents' amount.
        })
    }


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.user) { return }; // Guard Clause
        if (!formData.name.trim() || !formData.giftListId) { return }; // Form Validation Guard Clause

        setIsSubmitting(true);
        setStatus('Adding New Gift Item...');

        try {
            const newDocRef = doc(getGiftItemsCollRef(authState.user.uid, formData.giftListId));

            const newDocumentData: GiftItem = {
                id: newDocRef.id,
                name: formData.name,

                // Denormalized Data
                personId: formData.personId,
                personName: formData.personName,

                // Status & Associations
                giftListId: formData.giftListId,
                status: formData.status,
                eventId: formData.eventId,

                // // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
                estimatedCost: formData.estimatedCost,
                purchasedCost: formData.purchasedCost,

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            await setDoc(newDocRef, newDocumentData);

            setStatus('New Gift Item Added!! Closing in 2 seconds...');
            setFormData(defaultFormValues);

            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error) {
            console.error('Error Adding New Item. Error:', error);
            setStatus('Error Adding New Gift Item. Try Again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <BaseModal isOpen={isOpen} onClose={onClose}>
            <div className={styles.addGiftItemModal}>
                <header className={styles.header}>
                    <h2>Add Gift Item</h2>
                    <button type='button' className={styles.closeModalButton} onClick={() => { onClose() }}>
                        <X size={30} />
                    </button>
                </header>

                <form className={styles.form} onSubmit={handleSubmit} autoComplete='off'>
                    <label className={styles.label}>Gift Item:
                        <input
                            className={styles.input}
                            type='text'
                            name='name'
                            required={true}
                            value={formData.name}
                            onChange={handleTextInputChange}
                        />
                    </label>

                    {/* Selecting "person" gives personId, personName, AND ***giftListId*** (which is needed for storing Gift Item Location) */}
                    <select
                        name='person'
                        onChange={handlePersonDropdownInputChange}
                        required={true}
                        className={styles.dropdown}
                    >
                        <option
                            value=''
                            className={styles.option}
                        >Choose Person</option>

                        {people.map(person => (
                            <option
                                key={person.id}
                                value={person.id}
                                className={styles.option}
                            >{person.name}</option>
                        ))}
                    </select>

                    {/* Changing Status will change available fields: eventId (show/hide) & estimatedCost/purchasedCost. */}
                    <select
                        name='status'
                        onChange={handleStatusDropdownInputChange}
                        required={true}
                        className={styles.dropdown}
                    >
                        <option
                            value='idea'
                            className={styles.option}
                        >
                            Gift Idea
                        </option>

                        <option
                            value='purchased'
                            className={styles.option}
                        >
                            Purchased
                        </option>
                    </select>

                    {/* Choose Event (Only if "status" === 'purchased') */}
                    <select
                        name='eventId'
                        onChange={handleEventDropdownInputChange}
                        required={false}
                        className={styles.dropdown}
                    >
                        <option
                            value=''
                            className={styles.option}
                        >Choose Event</option>

                        {eventOptions.map(event => (
                            <option
                                key={event.id}
                                value={event.id}
                                className={styles.option}
                            >{event.title}</option>
                        ))}
                    </select>

                    {/* EstimatedCost or PurchasedCost (Changes depending on status === idea/purchased) */}
                    <label>
                        {formData.status === 'idea' && (<>Estimated Cost:</>)}
                        {formData.status === 'purchased' && (<>Purchased Cost:</>)}

                        <input
                            type='number'
                            name={formData.status === 'purchased' ? 'purchasedCost' : 'estimatedCost'} // 1 Input for both estimated & purchased cost
                            step='0.01' // for 'cents'
                            min='0'
                            placeholder='$0.00'
                            defaultValue={formData.status === 'purchased' ? 
                                (formData.purchasedCost ? formData.purchasedCost / 100 : '') :
                                (formData.estimatedCost ? formData.estimatedCost / 100 : '')
                            }
                            onBlur={handleCostChange}
                            className={styles.inputText}
                        />
                    </label>

                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Gift Item...</>) : (<>Add New Gift Item</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}