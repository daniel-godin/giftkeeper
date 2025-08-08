export const getDaysUntilDate = (date: string) => {
    // date string should be either 'yyyy-mm-dd' or '1900-mm-dd' 1900 being default/fake year.

    const formattedDate = new Date(date);
    const today = new Date();
    const currentYear = today.getFullYear();

    // Always use current year for countdown, regardless of stored year
    const nextBirthday = new Date(currentYear, formattedDate.getMonth(), formattedDate.getDate());

    if (nextBirthday < today) {
        nextBirthday.setFullYear(currentYear + 1);
    }

    const diffTime = nextBirthday.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// Checks if birthday Date is today or in the past.
export const isValidBirthday = (birthday: string): boolean => {
    if (!birthday) { return false }; // Guard Clause

    const [year, month, day] = birthday.split('-').map(Number); // Convert birthday to Date.UTC compatible input.
    const birthdayTimestamp = Date.UTC(year, month - 1, day);
    const now = Date.now();

    return birthdayTimestamp <= now; // If birthdayTimestamp <= now, return true. Birthdays can only be in the past technically.
}

// Checking whether an eventDate is today or later.
export const isValidEventDate = (eventDate: string): boolean => {
    if (!eventDate) { return false }; // Guard Clause

    const [year, month, day] = eventDate.split('-').map(Number); // Convert eventDate to Date.UTC compatible input.
    const eventTimestamp = Date.UTC(year, month - 1, day);

    const today = new Date();
    const todayAtMidnightUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()); // Need to convert today to UTC midnight for a proper comparison.

    return eventTimestamp >= todayAtMidnightUTC;
}