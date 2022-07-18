import React, {DetailedHTMLProps, InputHTMLAttributes, useContext, forwardRef} from "react";
import $c from "classnames";
import omit from "lodash.omit";
import AppContext from "../../providers/AppContext";

type ReactInputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type InputProps =  (ReactInputProps & {
  field: string;
  input?: JSX.Element;
});

const Input = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  /**
   * TODO: Move this up to ErrorableInput
   */
  const {
    err: {hasError}
  } = useContext(AppContext);

  /**
   * We use field consistently here to denote the field of some data type (like error)
   */
  const _props = {
    ...omit(props, 'field'),
    'name': props.field,
    'type': props.type || 'text'
  }

  const typeMap = new Map<string, JSX.Element>([
    ['textarea', (
      // @ts-ignore
      <textarea ref={ref} {..._props} className={$c(props.className, 'p-2 border-2', {
        'border-error': hasError(props.name)
      })} />
    )]
  ])

  if(typeMap.has(_props.type)) {
    return typeMap.get(_props.type)!;
  }

  if(props.input) {
    return props.input;
  }

  return <input ref={ref} {..._props} className={$c(props.className, 'p-2', {
    'border-error': hasError(props.name)
  })} />
})

export default Input;
