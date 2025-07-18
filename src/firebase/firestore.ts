// Each Helper Function Returns a Document/Collection REFERENCE, not the document/collection data itself.

import { collection, collectionGroup, doc } from "firebase/firestore"
import { db } from "./firebase";

// =============================================================================
// User References
// =============================================================================
export const getUserCollRef = () => collection(db, 'users');
export const getUserDocRef = (userId: string) => doc(db, 'users', userId);

// =============================================================================
// People/Person References (different than User)
// =============================================================================
export const getPeopleCollRef = (userId: string) => collection(db, 'users', userId, 'people');
export const getPersonDocRef = (userId: string, personId: string) => doc(db, 'users', userId, 'people', personId);

// =============================================================================
// Event References
// =============================================================================
export const getEventsCollRef = (userId: string) => collection(db, 'users', userId, 'events');
export const getEventDocRef = (userId: string, eventId: string) => doc(db, 'users', userId, 'events', eventId);

// =============================================================================
// Gift Item References
// =============================================================================
export const getPersonGiftItemsCollRef = (userId: string, personId: string) => collection(db, 'users', userId, 'people', personId, 'giftItems');
export const getPersonGiftItemDocRef = (userId: string, personId: string, itemId: string) => doc(db, 'users', userId, 'people', personId, 'giftItems', itemId);

// =============================================================================
// Gift Item Collection Group Queries
// =============================================================================
export const getAllGiftItemsCollGroupRef = () => collectionGroup(db, 'giftItems');