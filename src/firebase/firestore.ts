// Each Helper Function Returns a Document/Collection REFERENCE, not the document/collection data itself.

import { collection, doc } from "firebase/firestore"
import { db } from "./firebase";

// =============================================================================
// User References
// =============================================================================
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
// Gift Lists References
// =============================================================================
export const getGiftListsCollRef = (userId: string) => collection(db, 'users', userId, 'giftLists');
export const getGiftListDocRef = (userId: string, giftListId: string) => doc(db, 'users', userId, 'giftLists', giftListId);

// =============================================================================
// Gift Item References
// =============================================================================
export const getGiftItemsCollRef = (userId: string, giftListId: string) => collection(db, 'users', userId, 'giftLists', giftListId, 'giftItems');
export const getGiftItemDocRef = (userId: string, giftListId: string, itemId: string) => doc(db, 'users', userId, 'giftLists', giftListId, 'giftItems', itemId);

// =============================================================================
// Wish List References
// =============================================================================
export const getWishListsCollRef = (userId: string) => collection(db, 'users', userId, 'wishLists');
export const getWishListDocRef = (userId: string, wishListId: string) => doc(db, 'users', userId, 'wishLists', wishListId);

// =============================================================================
// Wish Item References
// =============================================================================
export const getWishItemsCollRef = (userId: string, wishListId: string) => collection(db, 'users', userId, 'wishLists', wishListId, 'wishItems');
export const getWishItemDocRef = (userId: string, wishListId: string, itemId: string) => doc(db, 'users', userId, 'wishLists', wishListId, 'wishItems', itemId);
