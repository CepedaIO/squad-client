import {forwardRef} from "react";
import Input, {InputProps} from "../inline/Input";
import ErrorOutput from "../ErrorOutput";
import {extractWidths} from "../../services/extract";
import $c from "classnames";

const ErrorableInput = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  const [widthClasses, inputClasses] = extractWidths(props.className);

  console.log(props.className);
  console.log(widthClasses);

  return <section className={$c('inline-block', ...widthClasses, 'bg-red-300')}>
    <Input {...props} ref={ref} className={inputClasses} />
    <ErrorOutput field={props.field} />
  </section>
})

export default ErrorableInput;
