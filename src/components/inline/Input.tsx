import React, {DetailedHTMLProps, InputHTMLAttributes, useContext, forwardRef} from "react";
import {ErrorContext} from "../../providers/ErrorProvider";
import $c from "classnames";
import omit from "lodash.omit";

export type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
  field: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  const {hasError} = useContext(ErrorContext);

  /**
   * We use field consistently here to denote the field of some data type (like error)
   */
  const _props = {
    ...omit(props, 'field'),
    'name': props.field
  };

  return <input ref={ref} {..._props} className={$c(props.className, 'p-2', {
    'border-error': hasError(props.name)
  })} />
})

export default Input;
