/**
 * Something weird with regex prevents me from re-using the same instance
 */
export const test = (regex: RegExp, str: string) => (new RegExp(regex)).test(str);
export const newDebug = (id:string) => (...msg:Array<string | number>) => console.log(`${id}:`, ...msg);
export const ist = <T>(test: (obj:any) => boolean) => (obj:any): obj is T => test(obj);
export const upsert = <T>(arr: Array<T>, entry: Partial<T> | null, replacedBy: T): Array<T> => {
  const index = !entry ? -1 : arr.indexOf(entry as T);

  return index === -1 ? arr.concat(replacedBy) : [
    ...arr.slice(0, index),
    replacedBy,
    ...arr.slice(index+1, arr.length)
  ];
}
export const remove = <T>(arr: Array<T>, entry: Partial<T> | null): Array<T> =>
  arr.filter((_entry) => entry !== _entry);
