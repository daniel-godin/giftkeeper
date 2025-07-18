import { DataSync } from "../services/DataSync";
import { EventsProvider } from "./EventsContext";
import { PeopleProvider } from "./PeopleContext";

export function DataProvider({ children } : { children: React.ReactNode }) {
    return (
        <PeopleProvider>
            <EventsProvider>
                <DataSync>
                    {children}
                </DataSync>
            </EventsProvider>
        </PeopleProvider>
    )
}