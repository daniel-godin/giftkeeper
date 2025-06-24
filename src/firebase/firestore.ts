// Returns various re-used Firestore collection and document paths.

import { collection, doc, orderBy, query, where } from "firebase/firestore"
import { db } from "./firebase";

export const getUserDoc = (userId: string) => {
    return doc(db, 'users', userId);
}

export const getPeopleCollection = (userId: string) => {
    return collection(db, 'users', userId, 'people');
}

export const getPersonDocument = (userId: string, personId: string) => {
    return doc(db, 'users', userId, 'people', personId);
}

export const getEventsCollection = (userId: string) => {
    return collection(db, 'users', userId, 'events');
}

export const getGiftListsCollection = (userId: string) => {
    return collection(db, 'users', userId, 'giftLists');
}

export const getGiftListDoc = (userId: string, giftListId: string) => {
    return doc(db, 'users', userId, 'giftLists', giftListId);
}

export const getGiftItemsCollection = (userId: string, giftListId: string) => {
    return collection(db, 'users', userId, 'giftLists', giftListId, 'items');
}

export const getGiftItemDoc = (userId: string, giftListId: string, itemId: string) => {
    return doc(db, 'users', userId, 'giftLists', giftListId, 'items', itemId);
}

// Events Firestore Helpers:
// Possibly... get"Current"BirthdayDocRef
export const getBirthdayDocRef = async (userId: string, personId: string) => {
    return query(
        getEventsCollection(userId), 
        where('personId', '==', personId),
        where('type', '==', 'birthday'),
        orderBy('date', 'asc')
        // limit(1)?????, maybe do desc???
    )
    // const birthdayEvents = await getDocs
}

// Wish List Firestore Helpers:
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