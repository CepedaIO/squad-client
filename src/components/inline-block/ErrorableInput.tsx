import {forwardRef, useContext, useEffect, useRef} from "react";
import Input, {InputProps} from "../inline/Input";
import ErrorOutput from "../ErrorOutput";
import {extractWidths} from "../../services/extract";
import $c from "classnames";
import omit from "lodash.omit";
import AppContext from "../../providers/AppContext";
import {Validator} from "../../services/validate";

export interface ErrorableInputProps extends InputProps {
  validators?: Validator[];
}

const ErrorableInput = forwardRef<HTMLInputElement, ErrorableInputProps>((props: ErrorableInputProps, ref) => {
  const {
    err: {hasError},
    page: {addValidators}
  } = useContext(AppContext);
  const [inputClasses, widthClasses] = extractWidths(props.className);
  const inputProps = omit(props, 'validators');
  const { field } = props;

  const { current: validators } = useRef(props.validators);

  useEffect(() => {
    if(validators) addValidators(field, validators);
  }, [field, validators])

  return <section className={$c('inline-block', widthClasses)}>
    <Input
      {...inputProps}
      ref={ref}
      className={
        $c(inputClasses, 'w-full', {
          'border-error': hasError(props.field)
        })
      }
    />
    <ErrorOutput field={props.field} />
  </section>
})

export default ErrorableInput;
