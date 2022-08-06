import Input, {InputProps} from "../../components/inline/Input";
import {useContext, useEffect} from "react";
import FormContext, {IFormContext} from "../../providers/FormContext";
import {omit} from "lodash";
import $c from "classnames";

export interface FormInputProps<Values extends Keyed, Field extends StringKey<Values>> extends Omit<InputProps<Values[Field]>, 'value'> {
  field: Field;
  validator?: Validator<Values, Field>;
  label: string;
  nowrap?: boolean;
  omit?: (values: Partial<Values>) => boolean;
}

const FormInput = <Values extends Keyed, Field extends StringKey<Values>>(props: FormInputProps<Values, Field>) => {
  const { field, validator } = props;
  const { onChange, setValidator, values, hasError, getError, setOmitValidation } = useContext<IFormContext<Values>>(FormContext);

  const inputProps: InputProps<Values[Field]> = {
    ...omit(props, ['label', 'field', 'nowrap', 'validator']),
  };

  const error = getError(field)?.message;

  useEffect(() => {
    if(validator) { setValidator(field, validator); }
    if(props.omit) { setOmitValidation(field, props.omit); }
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

    <section className={"min-h-[20px] text-right text-error text-sm"}>
      { error }
    </section>
  </main>
  )
}

export default FormInput;