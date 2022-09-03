import React, {ChangeEvent, ChangeEventHandler, InputHTMLAttributes} from "react";
import $c from "classnames";
import {isNaN, omit} from "lodash";

export interface InputTypeMap {
  date: string;
  'datetime-local': string;
  text: string;
  textarea: string;
  number: number;
}

type InputElements = HTMLInputElement | HTMLTextAreaElement;
export type SimpleInputTypes = keyof InputTypeMap;

export type InputProps<Type extends SimpleInputTypes> = Omit<InputHTMLAttributes<InputElements>, 'type' | 'value' | 'onChange'> & {
  type: Type;
  value?: InputTypeMap[Type];
  onChange?: (value: InputTypeMap[Type] | null) => void;
  placeholder?: string;
}

const Input = <Type extends keyof InputTypeMap>(props: InputProps<Type>) => {
  const _props = omit(props, ['onChange', 'className']);
  const onChange: ChangeEventHandler = (event: ChangeEvent<InputElements>) => {
    const val = event.target.value;
    if(props.onChange) {
      if(props.type === 'number') {
        if(isNaN(val) || val === '') {
          props.onChange(null);
        } else {
          props.onChange(parseFloat(val) as InputTypeMap[Type]);
        }
      } else {
        props.onChange(val as InputTypeMap[Type]);
      }
    }
  }

  if(props.type === 'textarea') {
    return (
      <textarea
        {..._props }
        className={$c(props.className, 'p-2 border-2')}
        onChange={ onChange }
      />
    );
  }


  return (
    <input
      {..._props }
      className={$c(props.className, 'p-2')}
      onChange={onChange}
    />
  );
};

export default Input;
