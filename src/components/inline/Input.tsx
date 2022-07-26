import React, {DetailedHTMLProps, InputHTMLAttributes} from "react";
import $c from "classnames";
import omit from "lodash.omit";

type ReactInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLConvergentInputElement>, HTMLConvergentInputElement>;

export interface OverrideProps<T> {
  type: TypeDescriptor<T>
  value?: T;
  onChange?: (val: T) => void;
}

export type InputProps<T> = Omit<ReactInputProps, keyof OverrideProps<T>> & OverrideProps<T>;

export type HTMLConvergentInputElement = HTMLInputElement & HTMLTextAreaElement;

const Input = <T,>(props: InputProps<T>) => {
  /**
   * We use field consistently here to denote the field of some data type (like error)
   */
  const _props = {
    ...omit(props, 'onChange', 'type', 'value'),
    'type': props.type.type
  };

  const value = props.value ? props.type.out(props.value) : undefined;

  if(_props.type === 'textarea') {
    return (
      <textarea
        {..._props}
        className={$c(props.className, 'p-2 border-2')}
        value={value}
        onChange={(event) => {
          if (props.onChange) {
            const value = props.type.in(event.target.value);
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
        console.log(event.target.value);
        const value = props.type.in(event.target.value);
        props.onChange(value);
      }
    }}
  />
};

export default Input;
