import styles from './AddGiftItemModal.module.css';
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { GiftItem } from "../../../types/GiftType";
import { BaseModal } from "../BaseModal/BaseModal";
import { X } from 'lucide-react';
import { getGiftItemsCollRef, getPeopleCollRef } from '../../../firebase/firestore';
import { doc, serverTimestamp, writeBatch } from 'firebase/firestore';
import { usePeople } from '../../../contexts/PeopleContext';
import { useUpcomingEvents } from '../../../hooks/useUpcomingEvents';
import { Event } from '../../../types/EventType';
import { db } from '../../../firebase/firebase';
import { Person } from '../../../types/PersonType';
import { DEFAULT_GIFT_ITEM, DEFAULT_PERSON } from '../../../constants/defaultObjects';
import { useParams } from 'react-router';
import { useEvents } from '../../../contexts/EventsContext';
import { FormInput, FormSelect, FormSubmitButton } from '../../ui';
import { sanitizeURL } from '../../../utils';
import { useToast } from '../../../contexts/ToastContext';
import { devError } from '../../../utils/logger';

interface AddGiftItemModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AddGiftItemModal({ isOpen, onClose } : AddGiftItemModalProps) {
    const { authState } = useAuth();
    const { people } = usePeople();
    const { events } = useEvents();
    const { personId, eventId } = useParams();
    const { addToast } = useToast();

    const [formData, setFormData] = useState<GiftItem>(DEFAULT_GIFT_ITEM);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [showCreateNewPerson, setShowCreateNewPerson] = useState<boolean>(false);
    const [showOptionalFields, setShowOptionalFields] = useState<boolean>(false);

    // Get upcoming events for selected "person" to display in dropdown.  Default is '' per defaultFormValues.
    // eventOptions makes sure to grab personId if dropdown changed to 'purchased' & personId is valid. Otherwise empty array of <Event>[].
    const upcomingEventsForPersonId = useUpcomingEvents(formData.personId);
    // const eventOptions: Event[] = formData.status === 'purchased' && formData.personId ? upcomingEventsForPersonId : [];

    const eventOptions: Event[] = useMemo(() => {
        if (formData.status !== 'purchased') { return [] }; // Guard Clause. Needs to be purchased to show.

        if (eventId) {
            return events.filter(event => event.id === eventId);
        } else if (formData.personId) {
            return upcomingEventsForPersonId;
        }

        return [];
    }, [formData.status, eventId, formData.personId, events, upcomingEventsForPersonId])

    const transformedEventOptions = useMemo(() =>
        eventOptions.map(event => ({
            optionLabel: event.title,
            optionValue: event.id || ''
        })), [eventOptions]
    );

    // Transforms People to a <FormSelect> format
    const transformedPeopleOptions = useMemo(() => {
        const options = [
            { optionLabel: '---', optionValue: '' }, // Blank Option
            ...people.map(person => ({
                optionLabel: person.name,
                optionValue: person.id || ''
            })),
            { optionLabel: '+ Create New Person', optionValue: 'createNewPerson' } // Special option
        ]

        return options;
    }, [people]);

    useEffect(() => {
        if (isOpen) {
            let initialFormData = { ...DEFAULT_GIFT_ITEM };

            // Pre-fill person data if on PersonPage
            if (personId) {
                const person = people.find(p => p.id === personId);
                if (person) {
                    initialFormData = {
                        ...initialFormData,
                        personId: person.id,
                        personName: person.name,
                    }
                }
            }

            // Pre-fill event data if on EventPage
            if (eventId) {
                initialFormData = {
                    ...initialFormData,
                    eventId: eventId,
                    status: 'purchased' // Only on EventPage is 'purchased' the default
                }
            }

            setFormData(initialFormData);
            setIsSubmitting(false);
            setShowCreateNewPerson(false);
            setShowOptionalFields(!!eventId); // Open optional fields if on EventPage, otherwise closed.
        }
    }, [isOpen, personId, eventId, people]);

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
                personName: ''
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

        try {
            const batch = writeBatch(db); // Using Batch for a possible GiftItem + New Person combo.

            let finalPersonId: string;

            // Create New Person & New Person (if needed) -- Both Will Be Needed For New GiftItem
            if (showCreateNewPerson) {
                const newPersonDocRef = doc(getPeopleCollRef(authState.user.uid));
                finalPersonId = newPersonDocRef.id;

                // New Person Document Data
                const personData: Person = {
                    ...DEFAULT_PERSON,
                    id: finalPersonId,
                    name: formData.personName.trim(),
                    birthday: '',
                    createdAt: serverTimestamp(),
                    updatedAt: serverTimestamp()
                }

                batch.set(newPersonDocRef, personData);

            } else {
                if (!formData.personId) { setIsSubmitting(false); return }; // If not creating new person, formData *MUST* have personId, otherwise data sync issues.
                finalPersonId = formData.personId;
            }

            const newDocRef = doc(getGiftItemsCollRef(authState.user.uid));
            const newDocumentData: GiftItem = {
                ...DEFAULT_GIFT_ITEM,
                id: newDocRef.id,
                name: formData.name,

                // Denormalized Data
                personId: finalPersonId,
                personName: formData.personName,

                // Status & Associations
                status: formData.status,
                eventId: formData.eventId,
                url: sanitizeURL(formData.url || ''),

                // // Costs -- Store in cents.  100 cents = 1 dollar.  Using 'number' for easier math.
                estimatedCost: formData.estimatedCost,
                purchasedCost: formData.purchasedCost,

                // Metadata
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp()
            }

            batch.set(newDocRef, newDocumentData);

            await batch.commit();

            let toastMessage = 'Successfully added a new gift item.'
            if (showCreateNewPerson) { toastMessage = 'Successfully added a new gift item & new person.'}

            addToast({
                type: 'success',
                title: 'Success!',
                message: toastMessage
            })

            setTimeout(() => {
                resetModal(); // Reset Form After Successful batch.commit();
                onClose();
            }, 500);

        } catch (error) {
            devError('Error Adding New Item. Error:', error)
            addToast({
                type: 'error',
                title: 'Error!',
                message: 'Error adding new gift item.  Please try again.',
                error: error as Error
            })
            setIsSubmitting(false);
        }
    }

    // Resets All State In Modal
    const resetModal = () => {
        setFormData(DEFAULT_GIFT_ITEM);
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

                    {/* Person Name: */}
                    <FormInput
                        label='Gift Item Idea or Purchase::'
                        type='text'
                        name='name'
                        required={true}
                        disabled={isSubmitting}
                        value={formData.name}
                        onChange={handleInputChange}
                    />

                    {/* Select Person  (Gift Recipient) */}
                    <FormSelect
                        label='Select Gift Recipient:'
                        options={transformedPeopleOptions}
                        name='person'
                        required={true}
                        disabled={isSubmitting}
                        value={formData.personId}
                        onChange={handlePersonDropdownInputChange}
                    />

                    {/* Create New Person -- For Now... Just Name, Skip Birthdate -- Maybe Automatically Go To Person URL After Creation? */}
                    {/* Conditionally Rendered ONLY when --- Create New Person is selected */}
                    {showCreateNewPerson && (
                        <FormInput
                            label='Create New Person:'
                            type='text'
                            name='personName'
                            required={true}
                            value={formData.personName}
                            disabled={isSubmitting}
                            onChange={handleInputChange}
                        />
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
                            {/* Gift Status Select.  Changing Status will change available fields: eventId (show/hide) & estimatedCost/purchasedCost. */}
                            <FormSelect
                                label='Gift Status (idea/purchased):'
                                options={[
                                    { optionLabel: 'Idea', optionValue: 'idea' },
                                    { optionLabel: 'Purchased', optionValue: 'purchased' }
                                ]}
                                name='status'
                                required={true}
                                disabled={isSubmitting}
                                value={formData.status}
                                onChange={handleInputChange}
                            />

                            {/* Choose Event (Only if "status" === 'purchased') */}
                            {formData.status === 'purchased' && formData.personId !== '' && (
                                <FormSelect
                                    label='Choose Event For Purchased Gift:'
                                    options={transformedEventOptions}
                                    name='eventId'
                                    placeholder='Choose Event'
                                    required={false}
                                    disabled={isSubmitting}
                                    value={formData.eventId}
                                    onChange={handleInputChange}
                                />
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


                            {/* Gift Item URL.  URL Validation happens in handleSubmit, NOT in change handler */}
                            <FormInput
                                label='URL:'
                                type='text'
                                name='url'
                                required={false}
                                disabled={isSubmitting}
                                value={formData.url}
                                onChange={handleInputChange}
                            />
                        </>
                    )}

                    <FormSubmitButton
                        text='Add Gift Item'
                        isSubmitting={isSubmitting}
                        submittingText='Adding Gift Item...'
                        disabled={!formData.name.trim() || !formData.personId || !formData.status}
                    />

                </form>
            </div>
        </BaseModal>
    )
}