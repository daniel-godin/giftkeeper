import styles from './AddGiftItemModal.module.css';
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { GiftItem } from "../../../types/GiftListType";
import { BaseModal } from "../BaseModal/BaseModal";
import { X } from 'lucide-react';
import { getGiftItemsCollRef, getGiftListDocRef } from '../../../firebase/firestore';
import { doc, serverTimestamp, setDoc, writeBatch } from 'firebase/firestore';
import { usePeople } from '../../../contexts/PeopleContext';
import { useUpcomingEvents } from '../../../hooks/useUpcomingEvents';
import { Event } from '../../../types/EventType';
import { db } from '../../../firebase/firebase';

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
    url: '',
    estimatedCost: 0,
    purchasedCost: 0,
}

export function AddGiftItemModal({ isOpen, onClose } : AddGiftItemModalProps) {
    const { authState } = useAuth();
    const { people } = usePeople();

    const [status, setStatus] = useState<string>('');
    const [formData, setFormData] = useState<GiftItem>(defaultFormValues);
    const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    // Get upcoming events for selected "person" to display in dropdown.  Default is '' per defaultFormValues.
    // eventOptions makes sure to grab personId if dropdown changed to 'purchased' & personId is valid. Otherwise empty array of <Event>[].
    const upcomingEventsForPersonId = useUpcomingEvents(formData.personId);
    const eventOptions: Event[] = formData.status === 'purchased' && formData.personId ? upcomingEventsForPersonId : [];

    useEffect(() => {
        if (isOpen) {
            setFormData(defaultFormValues)
            setStatus('');
        }
    }, [isOpen]);

    // FOR TESTING PURPOSES. TODO: DELETE THIS BEFORE PUSHING TO PROD
    // useEffect(() => {
    //     console.log('Form Data:', formData);
    //     console.log('personEvents:', upcomingEventsForPersonId);
    // }, [formData])

    // Default Input Change Handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePersonDropdownInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const person = people.find(person => person.id === e.target.value);

        if (!person) { return }; // Guard/Optimization Clause
        
        setFormData(prev => ({
            ...prev,
            personId: person.id,
            personName: person.name,
            giftListId: person.giftListId
        }))
    }

    const handleCostChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const numValue = parseFloat(value) || 0;

        // Allow empty string for better UX
        if (value === '') { setFormData(prev => ({ ...prev, [name]: 0 })); return};

        // Prevent negative number, but still update
        const sanitizedValue = Math.max(0, numValue); // Returns larger between the two, so... if negative, returns 0.
        setFormData(prev => ({
            ...prev,
            [name]: Math.round(sanitizedValue * 100) // Convert to cents
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!authState.user) { return }; // Guard Clause
        if (!formData.name.trim() || !formData.giftListId) { return }; // Form Validation Guard Clause

        setIsSubmitting(true);
        setStatus('Adding New Gift Item...');

        try {
            const batch = writeBatch(db); // Using batch to create GiftItem document & *update* parent GiftList updatedAt.

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
                url: validateURL(formData.url || ''),

                // // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
                estimatedCost: formData.estimatedCost,
                purchasedCost: formData.purchasedCost,

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            const parentGiftListDocRef = getGiftListDocRef(authState.user.uid, formData.giftListId);

            batch.set(newDocRef, newDocumentData);
            batch.update(parentGiftListDocRef, { updatedAt: serverTimestamp() });

            batch.commit();

            setFormData(defaultFormValues); // Reset Form After Successful batch.commit();

            setTimeout(() => {
                onClose();
            }, 500);

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
                    <label className={styles.label}>Gift Item Idea or Purchase: *
                        <input
                            className={styles.input}
                            type='text'
                            name='name'
                            required={true}
                            value={formData.name}
                            onChange={handleInputChange}
                        />
                    </label>

                    {/* Selecting "person" gives personId, personName, AND ***giftListId*** (which is needed for storing Gift Item Location) */}
                    <label className={styles.label}>Select Gift Recipient: *
                        <select
                            name='person'
                            onChange={handlePersonDropdownInputChange}
                            required={true}
                            value={formData.personId}
                            className={styles.dropdownInput}
                        >
                            <option
                                value=''
                                className={styles.option}
                            >---</option>

                            {people.map(person => (
                                <option
                                    key={person.id}
                                    value={person.id}
                                    className={styles.option}
                                >{person.name}</option>
                            ))}
                        </select>
                    </label>

                    {/* Show/Hide Optional Input Fields Toggle */}
                    {showOptionalFields ? (
                        <p className={styles.showOptionalFieldsText} onClick={() => setShowOptionalFields(false)}>
                            Hide Optional Fields
                        </p>
                    ) : (
                        <p className={styles.showOptionalFieldsText} onClick={() => setShowOptionalFields(true)}>
                            Show Optional Fields
                        </p>
                    )}

                    {showOptionalFields && (
                        <>
                            {/* Changing Status will change available fields: eventId (show/hide) & estimatedCost/purchasedCost. */}
                            <label className={styles.label}>Gift Status:
                                <select
                                    name='status'
                                    onChange={handleInputChange}
                                    required={true}
                                    value={formData.status}
                                    className={styles.dropdownInput}
                                >
                                    <option
                                        value='idea'
                                        className={styles.option}
                                    >
                                        Idea
                                    </option>

                                    <option
                                        value='purchased'
                                        className={styles.option}
                                    >
                                        Purchased
                                    </option>
                                </select>
                            </label>

                            {/* Choose Event (Only if "status" === 'purchased') */}
                            {formData.status === 'purchased' && formData.personId !== '' && (
                                <select
                                    name='eventId'
                                    onChange={handleInputChange}
                                    required={false}
                                    className={styles.dropdownInput}
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
                            )}

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
                                    value={formData.status === 'purchased' ? 
                                        (formData.purchasedCost ? formData.purchasedCost / 100 : '') :
                                        (formData.estimatedCost ? formData.estimatedCost / 100 : '')
                                    }
                                    onChange={handleCostChange}
                                    className={styles.input}
                                />
                            </label>

                            {/* URL Validation happens in handleSubmit, NOT in change handler */}
                            <label className={styles.label}>URL:
                                <input
                                    className={styles.input}
                                    type='text'
                                    name='url'
                                    required={false}
                                    value={formData.url}
                                    onChange={handleInputChange}
                                />
                            </label>
                        </>
                    )}




                    <output>
                        {status}
                    </output>

                    <button className={styles.submitButton} disabled={isSubmitting}>{isSubmitting ? (<>Adding New Gift Item...</>) : (<>Add New Gift Item</>)}</button>
                </form>
            </div>
        </BaseModal>
    )
}

// Note:  This is very basic and quite permissive
const validateURL = (url: string): string => {
    if (!url) { return '' }; // Guard, if falsey, return empty string

    try {
        const urlToTest = url.startsWith('http') ? url : `http://${url}`;
        new URL(urlToTest);
        return urlToTest
    } catch {
        return ''; // Invalid URL
    }
}