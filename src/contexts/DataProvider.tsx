import { DataSync } from "../services/DataSync";
import { EventsProvider } from "./EventsContext";
import { GiftItemsProvider } from "./GiftItemsContext";
import { PeopleProvider } from "./PeopleContext";

export function DataProvider({ children } : { children: React.ReactNode }) {
    return (
        <PeopleProvider>
            <EventsProvider>
                <GiftItemsProvider>
                    <DataSync>
                        {children}
                    </DataSync>
                </GiftItemsProvider>
            </EventsProvider>
        </PeopleProvider>
    )
}