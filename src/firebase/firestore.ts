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
export const getPeopleCollRef = (userId: string) => {
    return collection(db, 'users', userId, 'people');
}

export const getPersonDocument = (userId: string, personId: string) => {
    return doc(db, 'users', userId, 'people', personId);
}

// =============================================================================
// Event References
// =============================================================================
export const getEventsCollection = (userId: string) => {
    return collection(db, 'users', userId, 'events');
}

export const getEventDocRef = (userId: string, eventId: string) => {
    return doc(db, 'users', userId, 'events', eventId);
}

// =============================================================================
// Gift Lists & Gift Item References
// =============================================================================
export const getGiftListsCollection = (userId: string) => {
    return collection(db, 'users', userId, 'giftLists');
}

export const getGiftListDocRef = (userId: string, giftListId: string) => {
    return doc(db, 'users', userId, 'giftLists', giftListId);
}

export const getGiftItemsCollection = (userId: string, giftListId: string) => {
    return collection(db, 'users', userId, 'giftLists', giftListId, 'giftItems');
}

export const getGiftItemDoc = (userId: string, giftListId: string, itemId: string) => {
    return doc(db, 'users', userId, 'giftLists', giftListId, 'giftItems', itemId);
}

// =============================================================================
// Wish List References
// =============================================================================
export const getWishListsCollection = (userId: string) => {
    return collection(db, 'users', userId, 'wishLists');
}

export const getWishListDoc = (userId: string, wishListId: string) => {
    return doc(db, 'users', userId, 'wishLists', wishListId);
}

export const getWishItemsCollection = (userId: string, wishListId: string) => {
    return collection(db, 'users', userId, 'wishLists', wishListId, 'items');
}

export const getWishItemDoc = (userId: string, wishListId: string, itemId: string) => {
    return doc(db, 'users', userId, 'wishLists', wishListId, 'items', itemId);
}