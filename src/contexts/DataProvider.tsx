import { EventsProvider } from "./EventsContext";
import { GiftListsProvider } from "./GiftListsProvider";
import { PeopleProvider } from "./PeopleContext";
import { WishListsProvider } from "./WishListsProvider";

export function DataProvider({ children } : { children: React.ReactNode }) {
    return (
        <PeopleProvider>
            <EventsProvider>
                <GiftListsProvider>
                    <WishListsProvider>
                        {children}
                    </WishListsProvider>
                </GiftListsProvider>
            </EventsProvider>
        </PeopleProvider>
    )
}