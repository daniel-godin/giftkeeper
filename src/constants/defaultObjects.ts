import { GiftItem } from "../types/GiftType";


export const DEFAULT_GIFT_ITEM: GiftItem ={
    id: '',
    name: '',
    personId: '',
    personName: '',
    giftListId: '',
    status: 'idea', // idea is always default. 'idea' | 'purchased'
    eventId: '',
    url: '',
    estimatedCost: 0,
    purchasedCost: 0,
    // Shouldn't need createdAt or updatedAt.  These are handled under the hood, not "frontend" interactive.
}