

/**
 * Represents a calendar date with optional year.
 * Used for birthdays, anniversaries, and other recurring dates.
 */
export type CalendarDate = {
    month: number;    // 1-12
    day: number;      // 1-31
    year?: number;    // Optional
  };