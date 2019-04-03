/**
 * Returns true if the given dateString is valid, false otherwise
 *
 * @param dateString the string to be checked
 */
export function isValidDateString(dateString: string) {
  return `${new Date(dateString)}`.indexOf('Invalid') < 0;
}
