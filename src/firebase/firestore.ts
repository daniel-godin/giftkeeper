// Returns various re-used Firestore collection and document paths.

import { collection, doc } from "firebase/firestore"
import { db } from "./firebase";

export const getUserDoc = (userId: string) => {
    return doc(db, 'users', userId);
}

export const getPeopleCollection = (userId: string) => {
    return collection(db, 'users', userId, 'people');
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