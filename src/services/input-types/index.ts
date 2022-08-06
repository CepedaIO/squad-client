import {DateTime} from "luxon";
import {InputProps} from "../../components/inline/Input";

export type InputTypes = DateTime | string | number | boolean;
export type CustomInputProps<T extends InputTypes> = Omit<InputProps<T>, 'type'>

export interface TypeDescriptor<T extends InputTypes> {
  id: string;
  input: string | ((props: CustomInputProps<T>) => JSX.Element);
  in: (val: any) => T;
  out: (val: T) => any;
}

export type XTypeDescriptor<T> = T extends TypeDescriptor<infer U> ? U : T;
