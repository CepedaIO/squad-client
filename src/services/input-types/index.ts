export type CustomInputProps<Value> = {
  value?: Value;
  onChange?: (value:Value | null) => void;
  'data-cy'?: string;
  className?: string;
}

export type InputDescriptor<Value> = CustomInputDescriptor<Value>;

export interface CustomInputDescriptor<Value> {
  id: string;
  input: <InputProps extends CustomInputProps<Value>>(props: InputProps) => JSX.Element;
  ist: (val: any) => val is Value;
  out?: (val: Value) => any;
  in?: (val: any) => Value;
}
