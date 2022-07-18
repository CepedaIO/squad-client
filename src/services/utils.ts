/**
 * Something weird with regex prevents me from re-using the same instance
 */
export const test = (regex: RegExp, str: string) => (new RegExp(regex)).test(str);
export const newDebug = (id:string) => (...msg:Array<string | number>) => console.log(`${id}:`, ...msg);
export const ist = <T>(test: (obj:any) => boolean) => (obj:any): obj is T => test(obj);
