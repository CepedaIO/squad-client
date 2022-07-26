import {useContext} from "react";
import Input, {InputProps} from "../inline/Input";
import ErrorOutput from "../ErrorOutput";
import {extractWidths} from "../../services/extract";
import $c from "classnames";
import omit from "lodash.omit";
import AppContext from "../../providers/AppContext";
import FormContext from "../../providers/FormContext";

export interface ErrorableInputProps<Value> extends InputProps<Value> {
  field: string;
}

const ErrorableInput = <Value,>(props: ErrorableInputProps<Value>) => {
  const {
    err: {hasError},
  } = useContext(AppContext);

  const { onChange } = useContext(FormContext);
  const { field } = props;
  const [inputClasses, widthClasses] = extractWidths(props.className);

  const inputProps: InputProps<Value> = {
    ...omit(props, 'field'),
    name: field as string
  };

  return <section className={$c('inline-block', widthClasses)}>
    <Input
      { ...inputProps }

      onChange={(value) => onChange(field, value)}

      className={
        $c(inputClasses, 'w-full', {
          'border-error': hasError(props.field as string)
        })
      }
    />
    <ErrorOutput field={props.field as string} />
  </section>
};

export default ErrorableInput;
