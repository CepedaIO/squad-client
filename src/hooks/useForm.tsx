import {useCallback, useContext, useEffect} from "react";
import FormContext, {IFormContext} from "../providers/FormContext";
import omit from "lodash.omit";
import $c from "classnames";
import Input, {InputProps} from "../components/inline/Input";
import ErrorOutput from "../components/ErrorOutput";
import AppContext from "../providers/AppContext";

export interface FormInputProps<Values extends Keyed, Field extends StringKeys<Values>> extends Omit<InputProps<Values[Field]>, 'value'> {
  field: Field;
  validator?: Validator<Values, Field>;
  label: string;
  nowrap?: boolean;
}

const _FormInput = <Values extends Keyed, Field extends StringKeys<Values>>(props: FormInputProps<Values, Field>) => {
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

export const useForm = <Values,>() => {
  const { values, validate } = useContext(FormContext);

  const FormInput = useCallback(<Field extends StringKeys<Values>>(props: Omit<FormInputProps<Values, Field>, 'values'>) => (
    <_FormInput
      { ...props }
    />
  ), []);

  return {
    validate,
    values,
    FormInput
  } as {
    validate: (fields?:string[]) => [false, Partial<Values>],
    FormInput: typeof FormInput
    values: Partial<Values>
  } | {
    validate: (fields?: string[]) => [true, Values],
    FormInput: typeof FormInput
    values: Values
  };
}
