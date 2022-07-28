interface Array<T> {
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): Array<T>;
}

type Keyed<T = any> = { [key:string | number]: T };
type Tuple<T, K = T> = [T, K];

type CustomValidator<Values extends Keyed, Field extends keyof Values & string> = ((val: Values[Field], ctx: {
  field: Field;
  values: Partial<Values>;
}) => Tuple<boolean, string>);
type FieldValidator<Values extends Keyed, Field extends keyof Values & string> =
  Array<CustomValidator<Values, Field> | AssertionWithMessage<Values[Field]>>;

type Assertion<Value> = ((val: Value) => boolean) & { message?: string };
type AssertionWithMessage<Value> = Tuple<Assertion<Value>, string>;

interface TypeDescriptor<T> {
  id: string;
  type: string;
  in: (val: any) => T;
  out: (val: T) => any;
}

