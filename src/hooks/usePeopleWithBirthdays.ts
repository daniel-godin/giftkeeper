/**
 * Returns people who have a birthday date configured.
 * Useful for dashboard stats and birthday-related features.
 */

import { useMemo } from "react";
import { usePeople } from "../contexts/PeopleContext";

export function usePeopleWithBirthdays() {
    const { people } = usePeople();

    return useMemo(() => {
        return people.filter(person => person.birthday !== '' && person.birthday?.trim() !== '');
    }, [people])
}