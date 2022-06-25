/**
 * Something weird with regex prevents me from re-using the same instance
 */
export const test = (regex: RegExp, str: string) => (new RegExp(regex)).test(str);
