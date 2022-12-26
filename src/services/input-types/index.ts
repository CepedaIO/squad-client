import {InputProps} from "../../components/inline/Input";

export type CustomInputProps<Value> = {
  value?: Value;
  onChange?: (value:Value | null) => void;
  'data-cy'?: string;
  className?: string;
}

export type InputDescriptor<Value> = CustomInputDescriptor<Value>;

export interface CustomInputDescriptor<Value> {
  id: string;
  input: <InputType extends InputProps<any>>(props: InputType) => JSX.Element;
  ist: (val: any) => val is Value;
}
