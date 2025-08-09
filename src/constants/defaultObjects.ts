import { Event } from "../types/EventType";
import { GiftItem } from "../types/GiftType";
import { Person } from "../types/PersonType";
import { Toast } from "../types/ToastTypes";
import { UserProfile } from "../types/UserType";

export const DEFAULT_PERSON: Person = {
    id: '',
    name: '',
    birthday: '',
    nickname: '',
    notes: '',
    relationship: '',
}

export const DEFAULT_GIFT_ITEM: GiftItem = {
    id: '',
    name: '',
    personId: '',
    personName: '',
    status: 'idea', // idea is always default. 'idea' | 'purchased'
    eventId: '',
    url: '',
    estimatedCost: 0,
    purchasedCost: 0,
    // Shouldn't need createdAt or updatedAt.  These are handled under the hood, not "frontend" interactive.
}

export const DEFAULT_EVENT: Event = {
    id: '',
    title: '',
    people: [],
    date: '',
    type: '',
    recurring: false,
    budget: 0,
    notes: '',
}

export const DEFAULT_USER_PROFILE: UserProfile = {
    id: '',
    theme: 'light',
}

export const DEFAULT_TOAST: Toast = {
    id: '',
    type: 'info',
    title: '',
    message: '',
    error: undefined,
    duration: 5000 // Default is 5 seconds, saved in ms.
}