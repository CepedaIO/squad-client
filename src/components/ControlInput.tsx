import Input, {InputProps, SimpleInputTypes} from "./inline/Input";
import {omit} from "lodash";
import $c from "classnames";
import Split from "./Split";
import {
  AdapterDescriptor,
  CustomInputDescriptor,
  InputDescriptor,
  isCustomInputDescriptor
} from "../services/input-types";
import {ist} from "../services/utils";

export interface AdapterInputProps<Value extends SimpleInputTypes> extends Omit<InputProps<Value>, 'type'> {
  type: { _descriptor: AdapterDescriptor<Value> },
  label: string;
  nowrap?: boolean;
  error?: string;
}

export interface InjectedInputProps<Value> {
  type: { _descriptor: CustomInputDescriptor<Value> };
  label: string;
  nowrap?: boolean;
  value?: Value;
  onChange?: (value: Value) => void;
  error?: string;
}

export type ControlInputProps<Value> = Value extends SimpleInputTypes ? AdapterInputProps<Value> : InjectedInputProps<Value>;

const formProps = ['field', 'validator', 'label', 'nowrap', 'omit'];

const getInput = <Value,>(props: ControlInputProps<Value>) => {
  const isInjectedInputProps = ist<InjectedInputProps<Value>>((obj) => isCustomInputDescriptor(obj.type._descriptor));

  if(isInjectedInputProps(props)) {
    const inputProps = omit(props, formProps.concat('type'));
    return props.type._descriptor.input(inputProps);
  } else {
    const inputProps: InputProps<InputDescriptor<Value>['input']> = {
      ...omit(props, formProps),
      type: props.type._descriptor.input,
      onChange: (value) => props.onChange && props.onChange(props.type._descriptor.in(value))
    };

    const value = inputProps.value ? props.type._descriptor.out(inputProps.value) : '';

    return (
      <Input
        { ...inputProps }
        value={value}
        className={
          $c('w-full', {
            'border-error': !!props.error
          })
        }
      />
    );
  }
};

const ControlInput = <Value,>(props: ControlInputProps<Value>) => (
  <main>
    <Split
      nowrap={props.nowrap}
      left={ <label>{ props.label }</label> }
      right={ getInput(props) }
    />

    <section className={"min-h-[20px] text-right text-error text-sm"}>
      { props.error }
    </section>
  </main>
);

export default ControlInput;
