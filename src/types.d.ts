interface Array<T> {
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): Array<T>;
}

type Keyed<T = any> = { [key:string | number]: T };
type Tuple<T, K = T> = [T, K];

type Validator<Values, Field extends keyof Values> = (val: Values[Field], ctx: {
  field: Field;
  values: Partial<Values>;
}) => string | null | undefined;

interface TypeDescriptor<T> {
  id: string;
  type: string;
  in: (val: any) => T;
  out: (val: T) => any;
}
