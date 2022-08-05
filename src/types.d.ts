interface Array<T> {
  forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): Array<T>;
}

type Keyed<T = any> = { [key:string | number]: T };
type StringKeys<T> = keyof T & string;
type Tuple<T, K = T> = [T, K];

type Validator<Values extends Keyed, Field extends StringKeys<Values>> =
  (values: Values, ctx: {
    field: Field,
    value?: Values[Field],
    required: (field: StringKeys<Values>, assertions:ValidatorSuite<Values[Field]>) => ValidatorSuite<Values[Field]>
    when: <OtherField extends StringKeys<Values>>(field: OtherField, condition: (field:Values[OtherField]) => boolean, assertions:ValidatorSuite<Values[Field]>) => ValidatorSuite<Values[Field]>
  }) => ValidatorSuite<Values[Field]>;

type Assertion<Value> = ((val: Value) => boolean);
type AssertionWithMessage<Value> = Tuple<Assertion<Value>, string>;
type AssertionResult<Value> = Tuple<true, Value> | Tuple<false, string>
type ValidatorSuite<Value> = Array<AssertionWithMessage<Value> | ValidatorSuite<Value>>
