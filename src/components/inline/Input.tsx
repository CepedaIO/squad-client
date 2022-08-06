import React, {ChangeEvent, ChangeEventHandler, useMemo, useState} from "react";
import $c from "classnames";
import {InputTypes} from "../../services/input-types";

export type InputProps<Type extends InputTypes = string> = {
  placeholder?: string;
  className?: string;
  type: string;
  value?: Type;
  onChange?: (value?: Type) => void;
}

const Input = <T extends InputTypes = string>(props: InputProps<T>) => {
  const initialValue = useMemo(() => props.value ? props.value : '', []);
  const [value, setValue] = useState<any>(initialValue);

  const onChange: ChangeEventHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(props.onChange) {
      setValue(event.target.value);
      props.onChange(event.target.value as T);
    }
  }

  if(props.type === 'textarea') {
    return (
      <textarea
        placeholder={props.placeholder}
        className={$c(props.className, 'p-2 border-2')}
        value={value}
        onChange={ onChange }
      />
    );
  }

  return <input
    type={props.type}
    placeholder={props.placeholder}
    className={$c(props.className, 'p-2')}
    value={value}
    onChange={ onChange }
  />
};

export default Input;
