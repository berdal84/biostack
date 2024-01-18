/**
 * Format a year range from a given start and end year.
 * When start and end year are identical, a single year is formated.
 * 
 * examples:
 *  getFormattedYearRange(2020, 2024) === "2020-2024"
 *  getFormattedYearRange(2024, 2024) === "2024"
 * 
 * @param start the year to start from
 * @param end the year to end with. Default is current year.
 */
export function getFormattedYearRange(start: number, end = new Date().getFullYear()): string {
    if (start > end) {
        throw new Error("start must be smaller or equal to end")
    }

    if (start === end) {
        return `${start}`
    }

    return `${start}-${end}`
}