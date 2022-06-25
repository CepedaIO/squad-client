import {forwardRef} from "react";
import Input, {InputProps} from "../inline/Input";
import ErrorOutput from "../ErrorOutput";

const ErrorableInput = forwardRef<HTMLInputElement, InputProps>((props: InputProps, ref) => {
  return <section className="inline-block w-full">
    <Input {...props} ref={ref} />
    <ErrorOutput field={props.field} />
  </section>
})

export default ErrorableInput;
