// Date string input "YYYY-MM-DD"
export const getDaysUntilDate = (date: string): number => {
    // Check format first
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
    }

    // Format both date string & today's date
    const [year, month, day] = date.split('-').map(Number); // Because "YYYY-MM-DD" returns midnight timestamp of UTC. (year, month -1, day) {month is zero indez} returns locale timezone.
    let formattedDate = new Date(year, month - 1, day);
    let today = new Date();

    // Check if date is actually valid (catches things like Feb 31st)
    if (formattedDate.getFullYear() !== year || formattedDate.getMonth() !== month - 1 || formattedDate.getDate() !== day) {
        throw new Error(`Invalid date: ${date}`);
    }

    // Set both dates to midnight for equality purposes
    formattedDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    // Get difference between dates in milliseconds, then convert to days
    const diffTime = formattedDate.getTime() - today.getTime();
    return Number(Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
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