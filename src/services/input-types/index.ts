import {InputTypeMap,} from "../../components/inline/Input";
import {ist} from "../utils";

export type CustomInputProps<Value> = {
  value?: Value;
  onChange?: (value:Value) => void;
}

export type InputDescriptor<Value> = CustomInputDescriptor<Value> | AdapterDescriptor<Value, any>;

export interface CustomInputDescriptor<Value> {
  id: string;
  input: (props: CustomInputProps<Value>) => JSX.Element;
}

export interface AdapterDescriptor<OutputType, InputType extends keyof InputTypeMap> {
  id: string;
  input: InputType;
  in: (val: InputTypeMap[InputType]) => OutputType;
  out: (val: OutputType) => InputTypeMap[InputType];
}

export const isTypeDescriptor = ist<InputDescriptor<any>>((obj) => typeof obj.id === 'string' && typeof obj.input !== 'undefined');
export const isCustomInputDescriptor = ist<CustomInputDescriptor<any>>((obj) => isTypeDescriptor(obj) && typeof obj.input === 'function');
export const isAdapterDescriptor = ist<AdapterDescriptor<any, any>>((obj) => isTypeDescriptor(obj) && !isCustomInputDescriptor(obj));
