import {forwardRef} from "react";
import Input, {InputProps} from "../inline/Input";
import ErrorOutput from "../ErrorOutput";
import {extractWidths} from "../../services/extract";
import $c from "classnames";

interface ValidateResult {
  valid: boolean;
  message: string;
}

export interface ErrorableInputProps extends InputProps {
  validate(value:never): ValidateResult;
}

const ErrorableInput = forwardRef<HTMLInputElement, ErrorableInputProps>((props: ErrorableInputProps, ref) => {
  const [inputClasses, widthClasses] = extractWidths(props.className);

  return <section className={$c('inline-block', widthClasses)}>
    <Input {...props} ref={ref} className={$c(inputClasses, 'w-full')} />
    <ErrorOutput field={props.field} />
  </section>
})

export default ErrorableInput;
