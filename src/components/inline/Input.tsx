import React, {DetailedHTMLProps, InputHTMLAttributes, useMemo, useState} from "react";
import $c from "classnames";
import omit from "lodash.omit";

type ReactInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLConvergentInputElement>, HTMLConvergentInputElement>;

export interface OverrideProps<T> {
  type: { _type: TypeDescriptor<T> }
  value?: T;
  onChange?: (val: T) => void;
}

export type InputProps<T> = Omit<ReactInputProps, keyof OverrideProps<T>> & OverrideProps<T>;

export type HTMLConvergentInputElement = HTMLInputElement & HTMLTextAreaElement;

const Input = <T,>(props: InputProps<T>) => {
  const descriptor = props.type._type || props.type;
  const initialValue = useMemo(() => props.value ? descriptor.out(props.value) : '', []);
  const [value, setValue] = useState(initialValue)

  /**
   * We use field consistently here to denote the field of some data type (like error)
   */
  const _props = {
    ...omit(props, 'onChange', 'type', 'value'),
    'type': descriptor.type
  };

  if(_props.type === 'textarea') {
    return (
      <textarea
        {..._props}
        className={$c(props.className, 'p-2 border-2')}
        value={value}
        onChange={(event) => {
          if (props.onChange) {
            const value = descriptor.in(event.target.value);
            props.onChange(value);
          }
        }}
      />
    );
  }

  return <input
    {..._props}
    className={
      $c(props.className, 'p-2')
    }
    value={value}
    onChange={ (event) => {
      if(props.onChange) {
        setValue(event.target.value);
        const value = descriptor.in(event.target.value);
        props.onChange(value);
      }
    }}
  />
};

export default Input;
