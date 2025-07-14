import styles from './AddGiftItemModal.module.css';
import { useEffect, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { GiftItem, GiftList } from "../../../types/GiftListType";
import { BaseModal } from "../BaseModal/BaseModal";
import { X } from 'lucide-react';
import { getGiftItemsCollRef, getGiftListDocRef, getGiftListsCollRef, getPeopleCollRef } from '../../../firebase/firestore';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { usePeople } from '../../../contexts/PeopleContext';
import { useUpcomingEvents } from '../../../hooks/useUpcomingEvents';
import { Event } from '../../../types/EventType';
import { db } from '../../../firebase/firebase';
import { Person } from '../../../types/PersonType';

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
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [showCreateNewPerson, setShowCreateNewPerson] = useState<boolean>(false);
    const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);

    // Get upcoming events for selected "person" to display in dropdown.  Default is '' per defaultFormValues.
    // eventOptions makes sure to grab personId if dropdown changed to 'purchased' & personId is valid. Otherwise empty array of <Event>[].
    const upcomingEventsForPersonId = useUpcomingEvents(formData.personId);
    const eventOptions: Event[] = formData.status === 'purchased' && formData.personId ? upcomingEventsForPersonId : [];

    useEffect(() => {
        if (isOpen) {
            resetModal();
        }
    }, [isOpen]);

    // Default Input Change Handler
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handlePersonDropdownInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // Handle when 'create new person' is selected.
        if (e.target.value === 'createNewPerson') {
            setShowCreateNewPerson(true); // Shows input box for creating a new personName.
            setFormData(prev => ({
                ...prev,
                personId: 'createNewPerson', // Temporary Marker.  Will be set in handleSubmit
            }))
            return;
        }

        // Handle existing person selection
        setShowCreateNewPerson(false);
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
        if (!formData.name.trim() || !formData.personName) { return }; // Form Validation Guard Clause

        setIsSubmitting(true);
        setStatus('Adding New Gift Item...');

        try {
            const batch = writeBatch(db); // Using batch to create GiftItem document & *update* parent GiftList updatedAt.

            let finalPersonId: string;
            let finalGiftListId: string;

            // Create New Person & New GiftList -- Both Will Be Needed For New GiftItem
            if (showCreateNewPerson) {
                const newPersonDocRef = doc(getPeopleCollRef(authState.user.uid));
                const newGiftListDocRef = doc(getGiftListsCollRef(authState.user.uid));
                finalPersonId = newPersonDocRef.id;
                finalGiftListId = newGiftListDocRef.id;

                // New Person Document Data
                const personData: Person = {
                    id: finalPersonId,
                    name: formData.personName.trim(),
                    giftListId: finalGiftListId,
                    birthday: '',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }

                // New Gift List Document Data
                const giftListData: GiftList = {
                    id: finalGiftListId,
                    title: `${formData.personName.trim()}'s Gift List`,
                    personId: finalPersonId,
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }
                batch.set(newPersonDocRef, personData);
                batch.set(newGiftListDocRef, giftListData);

            } else {
                if (!formData.personId || !formData.giftListId) { setIsSubmitting(false); return }; // If not creating new person, formData *MUST* have personId & giftListId, otherwise data sync issues.
                finalPersonId = formData.personId;
                finalGiftListId = formData.giftListId
            }

            const newDocRef = doc(getGiftItemsCollRef(authState.user.uid, finalGiftListId));
            const newDocumentData: GiftItem = {
                id: newDocRef.id,
                name: formData.name,

                // Denormalized Data
                personId: finalPersonId,
                personName: formData.personName,

                // Status & Associations
                giftListId: finalGiftListId,
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

            const parentGiftListDocRef = getGiftListDocRef(authState.user.uid, finalGiftListId);

            batch.set(newDocRef, newDocumentData);
            batch.update(parentGiftListDocRef, { updatedAt: serverTimestamp() });

            await batch.commit();

            setTimeout(() => {
                resetModal(); // Reset Form After Successful batch.commit();
                onClose();
            }, 500);

        } catch (error) {
            console.error('Error Adding New Item. Error:', error);
            setStatus('Error Adding New Gift Item. Try Again.');
            setIsSubmitting(false);
        }
    }

    // Resets All State In Modal
    const resetModal = () => {
        setStatus('');
        setFormData(defaultFormValues);
        setIsSubmitting(false);
        setShowCreateNewPerson(false);
        setShowOptionalFields(false);
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
                            disabled={isSubmitting}
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
                            disabled={isSubmitting}
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

                            <option
                                value='createNewPerson'
                                className={styles.option}
                            >+ Create New Person</option>

                        </select>
                    </label>

                    {/* Create New Person -- For Now... Just Name, Skip Birthdate -- Maybe Automatically Go To Person URL After Creation? */}
                    {/* Conditionally Rendered ONLY when --- Create New Person is selected */}
                    {showCreateNewPerson && (
                        <label className={styles.label}>Create New Person:
                            <input
                                className={styles.input}
                                type='text'
                                name='personName'
                                required={true}
                                value={formData.personName}
                                disabled={isSubmitting}
                                onChange={handleInputChange}
                            />
                        </label>
                    )}

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
                                    disabled={isSubmitting}
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
                                <label className={styles.label}>Choose Event For Purchased Gift:
                                    <select
                                        name='eventId'
                                        onChange={handleInputChange}
                                        required={false}
                                        disabled={isSubmitting}
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
                                </label>
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
                                    required={false}
                                    disabled={isSubmitting}
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
                                    disabled={isSubmitting}
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