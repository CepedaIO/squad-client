import {forwardRef} from "react";
import Input, {InputProps} from "../inline/Input";
import ErrorOutput from "../ErrorOutput";
import {extractWidths} from "../../services/extract";
import $c from "classnames";

const ErrorableInput = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  const [inputClasses, widthClasses] = extractWidths(props.className);

  return <section className={$c('inline-block', widthClasses)}>
    <Input {...props} ref={ref} className={$c(inputClasses, 'w-full')} />
    <ErrorOutput field={props.field} />
  </section>
})

export default ErrorableInput;
