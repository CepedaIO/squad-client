import {useContext, useEffect} from "react";
import FormContext, {IFormContext} from "../providers/FormContext";
import omit from "lodash.omit";
import $c from "classnames";
import Input, {InputProps} from "../components/inline/Input";
import ErrorOutput from "../components/ErrorOutput";
import AppContext from "../providers/AppContext";

export interface FormInputProps<Values extends Keyed, Field extends keyof Values & string> extends Omit<InputProps<Values[Field]>, 'value'> {
  field: Field;
  validator?: Validator<Values, Field>;
  label: string;
  nowrap?: boolean;
}

const _FormInput = <Values extends Keyed, Field extends keyof Values & string>(props: FormInputProps<Values, Field>) => {
  const {
    err: {hasError},
  } = useContext(AppContext);
  const { field, validator, type } = props;
  const { onChange, setValidator, values } = useContext<IFormContext<Values>>(FormContext);

  const inputProps: InputProps<Values[Field]> = {
    ...omit(props, ['label', 'field', 'nowrap', 'validator']),
    name: field
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
                'border-error': hasError(props.field as string)
              })
            }
          />
        </div>
      </section>

      <section className={
        $c('min-h-[20px] text-right')
      }>
        <ErrorOutput field={props.field as string} />
      </section>
    </main>
  )
}

export const useForm = <Values,>() => {
  const { values, validate } = useContext(FormContext);

  const FormInput = <Field extends keyof Values & string>(props: Omit<FormInputProps<Values, Field>, 'values'>) => (
    <_FormInput
      { ...props }
    />
  );

  type Options = {
    FormInput: typeof FormInput,
    validate: typeof validate
  };

  return [
    values,
    validate, {
      FormInput
    }
  ] as [ Partial<Values>, (fields?:string[]) => [false, Partial<Values>], Options]
    | [ Values, (fields?:string[]) => [true, Values], Options ];
}
