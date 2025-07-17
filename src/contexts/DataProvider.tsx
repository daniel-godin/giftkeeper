import { DataSync } from "../services/DataSync";
import { EventsProvider } from "./EventsContext";
import { PeopleProvider } from "./PeopleContext";
import { WishListsProvider } from "./WishListsProvider";

export function DataProvider({ children } : { children: React.ReactNode }) {
    return (
        <PeopleProvider>
            <EventsProvider>
                <WishListsProvider>
                    <DataSync>
                        {children}
                    </DataSync>
                </WishListsProvider>
            </EventsProvider>
        </PeopleProvider>
    )
}