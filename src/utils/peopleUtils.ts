// Utilities around people/person.
import { usePeople } from "../contexts/PeopleContext";

// Returns a person's nickname, or name or 'Unknown'
export const getPersonNameFromId = (personId: string): string => {
    const { people } = usePeople();
    const person = people.find(p => p.id === personId);
    return person?.nickname || person?.name || 'Unknown';
}