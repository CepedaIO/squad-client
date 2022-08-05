import {DateTime} from "luxon";

export type InputTypes = DateTime | string | number | boolean;

export interface TypeDescriptor<T extends InputTypes> {
  id: string;
  type: string;
  in: (val: any) => T;
  out: (val: T) => any;
}

export type XTypeDescriptor<T> = T extends TypeDescriptor<infer U> ? U : T;
