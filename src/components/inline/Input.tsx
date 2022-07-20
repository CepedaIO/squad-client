import React, {DetailedHTMLProps, InputHTMLAttributes, useContext, forwardRef} from "react";
import $c from "classnames";
import omit from "lodash.omit";
import AppContext from "../../providers/AppContext";

type ReactInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type InputProps =  (ReactInputProps & {
  field: string;
});

const Input = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  const {
    page: {onChange}
  } = useContext(AppContext);

  /**
   * We use field consistently here to denote the field of some data type (like error)
   */
  const _props = {
    ...omit(props, 'field', 'validate', 'onChange'),
    'name': props.field,
    'type': props.type || 'text'
  }

  const typeMap = new Map<string, JSX.Element>([
    ['textarea', (
      // @ts-ignore
      <textarea ref={ref} {..._props} className={$c(props.className, 'p-2 border-2')} />
    )]
  ])

  if(typeMap.has(_props.type)) {
    return typeMap.get(_props.type)!;
  }

  return <input
    {..._props}
    ref={ref}
    className={
      $c(props.className, 'p-2')
    }
    onChange={ (event) => {
      onChange(props.field, event.target.value);
      if(props.onChange) {
        props.onChange(event);
      }
    }}
  />
})

export default Input;
