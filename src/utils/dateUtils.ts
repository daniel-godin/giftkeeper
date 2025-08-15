// Date string input "YYYY-MM-DD"
export const getDaysUntilDate = (date: string): number => {
    // Check format first
    if (!isValidDate(date)) {
        throw new Error(`Invalid date: ${date}. Expected YYYY-MM-DD format`); // Can't return a number & can't do calculations with an invalid date string.  throw Error.
    }

    // Format both date string & today's date
    const [year, month, day] = date.split('-').map(Number); // Because "YYYY-MM-DD" returns midnight timestamp of UTC. (year, month -1, day) {month is zero indez} returns locale timezone.
    let formattedDate = new Date(year, month - 1, day);
    let today = new Date();

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

    if (!isValidDate(birthday)) { return false }; // Returns an invalid date string as false.  Cannot be a valid birthday.

    const [year, month, day] = birthday.split('-').map(Number); // Convert birthday to Date.UTC compatible input.
    const birthdayTimestamp = Date.UTC(year, month - 1, day);
    const now = Date.now();

    return birthdayTimestamp <= now; // If birthdayTimestamp <= now, return true. Birthdays can only be in the past technically.
}

// Checking whether an eventDate is today or later.
export const isValidEventDate = (eventDate: string): boolean => {
    if (!eventDate) { return false }; // Guard Clause

    if (!isValidDate(eventDate)) { return false }; // Return an invalid string as a false valid event date.

    const [year, month, day] = eventDate.split('-').map(Number); // Convert eventDate to Date.UTC compatible input.
    const eventTimestamp = Date.UTC(year, month - 1, day);

    const today = new Date();
    const todayAtMidnightUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()); // Need to convert today to UTC midnight for a proper comparison.

    return eventTimestamp >= todayAtMidnightUTC;
}

// Takes in a string, which should be formatted as "YYYY-MM-DD" and returns whether the date is real or not.  February 30th = false.
export const isValidDate = (date: string): boolean => {
    if (!date) { return false }; // Guard

    if (!isValidDateString(date)) { return false }; // Invalid Date String returns false

    const [year, month, day] = date.split('-').map(Number);
    const dateObject = new Date(year, month - 1, day);

    if (
        dateObject.getFullYear() !== year ||
        dateObject.getMonth() !== month - 1 ||
        dateObject.getDate() !== day
    ) {
        return false;
    }
    
    return true;
}

// Valid date string === "YYYY-MM-DD". No other format should be allowed.
export const isValidDateString = (dateString: string): boolean => {
    if (!dateString) { return false }; // Guard.  Missing input.

    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateString)) { return false };

    return true
}

// Valid date string === "YYYY-MM-DD".  Returns a shorted month (eg. Mar, instead of March), with the day.  No year returned.
export const formatBirthdayShort = (birthdayDate: string): string => {
    if (!birthdayDate) { return '--' }; // Guard.  Missing input
    if (!isValidDate(birthdayDate)) { return '--' }; // Invalid DateString.

    const [year, month, day] = birthdayDate.split('-').map(Number);
    const dateObject = new Date(year, month - 1, day);

    return dateObject.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    })
}