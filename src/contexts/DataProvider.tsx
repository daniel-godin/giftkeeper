import { EventsProvider } from "./EventsContext";
import { PeopleProvider } from "./PeopleContext";


export function DataProvider({ children } : { children: React.ReactNode }) {
    return (
        <PeopleProvider>
            <EventsProvider>
                {children}
            </EventsProvider>
        </PeopleProvider>
    )
}