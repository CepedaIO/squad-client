import Input, {InputProps} from "../../components/inline/Input";
import {useContext, useEffect} from "react";
import AppContext from "../../providers/AppContext";
import FormContext, {IFormContext} from "../../providers/FormContext";
import {omit} from "lodash";
import $c from "classnames";
import ErrorOutput from "../../components/ErrorOutput";

export interface FormInputProps<Values extends Keyed, Field extends StringKeys<Values>> extends Omit<InputProps<Values[Field]>, 'value'> {
  field: Field;
  validator?: Validator<Values, Field>;
  label: string;
  nowrap?: boolean;
}

const FormInput = <Values extends Keyed, Field extends StringKeys<Values>>(props: FormInputProps<Values, Field>) => {
  const {
    err: {hasError},
  } = useContext(AppContext);
  const { field, validator } = props;
  const { onChange, setValidator, values } = useContext<IFormContext<Values>>(FormContext);

  const inputProps: InputProps<Values[Field]> = {
    ...omit(props, ['label', 'field', 'nowrap', 'validator']),
  };

  useEffect(() => {
    if(validator) { setValidator(field, validator); }
  }, [])

  return (
  <main>
    <section className={$c({
      'col-to-row grow-children': props.nowrap,
      'flex flex-col': !props.nowrap
    })}>
      <label className={$c({
        'md:w-1/3': props.nowrap
      })}>{ props.label }</label>

      <div className={$c('inline-block', {
        'md:w-2/3': props.nowrap
      })}>
        <Input
        { ...inputProps }
        onChange={(value) => onChange(field, value)}
        value={values[field]!}
        className={
          $c('w-full', {
            'border-error': hasError(props.field)
          })
        }
        />
      </div>
    </section>

    <section className={
      $c('min-h-[20px] text-right')
    }>
      <ErrorOutput field={props.field} />
    </section>
  </main>
  )
}

export default FormInput;
