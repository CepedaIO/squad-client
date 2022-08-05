import React, {ChangeEvent, ChangeEventHandler, useMemo, useState} from "react";
import $c from "classnames";
import omit from "lodash.omit";
import {InputTypes, TypeDescriptor} from "../../services/input-types";


export type InputProps<Type extends InputTypes> = {
  className?: string;
  type: { _type: TypeDescriptor<Type> };
  value?: Type;
  onChange?: (value: Type) => void;
}

const Input = <T extends InputTypes>(props: InputProps<T>) => {
  const descriptor = props.type._type;
  const initialValue = useMemo(() => props.value ? descriptor.out(props.value) : '', []);
  const [value, setValue] = useState<any>(initialValue)

  /**
   * We use field consistently here to denote the field of some data type (like error)
   */
  const _props = {
    ...omit(props, 'onChange', 'type', 'value'),
    'type': descriptor.type
  };

  const onChange: ChangeEventHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if(props.onChange) {
      setValue(event.target.value);
      const value = descriptor.in(event.target.value);
      props.onChange(value);
    }
  }

  if(_props.type === 'textarea') {
    return (
      <textarea
        className={$c(props.className, 'p-2 border-2')}
        value={value}
        onChange={ onChange }
      />
    );
  }

  return <input
    type={descriptor.type}
    className={$c(props.className, 'p-2')}
    value={value}
    onChange={ onChange }
  />
};

export default Input;
