import Input, {InputProps} from "../../components/inline/Input";
import {useContext, useEffect} from "react";
import FormContext, {IFormContext} from "../../providers/FormContext";
import {omit} from "lodash";
import $c from "classnames";
import Split from "../../components/Split";
import {CustomInputProps, TypeDescriptor} from "../../services/input-types";

export interface FormInputProps<Values extends Keyed, Field extends StringKey<Values>> extends Omit<InputProps<Values[Field]>, 'type'> {
  field: Field;
  type: { _descriptor: TypeDescriptor<Values[Field]> };
  validator?: Validator<Values, Field>;
  label: string;
  nowrap?: boolean;
  omit?: (values: Partial<Values>) => boolean;
}
const formProps = ['field', 'validator', 'label', 'nowrap', 'omit'];

const getInput = <Values extends Keyed, Field extends StringKey<Values>>(props: FormInputProps<Values, Field>) => {
  const { field } = props;
  const descriptor = props.type._descriptor;
  const { onChange, values, hasError } = useContext<IFormContext<Values>>(FormContext);

  if(typeof descriptor.input === 'string') {
    const inputProps: InputProps<Values[Field]> = {
      ...omit(props, formProps),
      type: descriptor.input
    };

    return (
      <Input
        { ...inputProps }
        onChange={(value) => onChange(field, descriptor.in(value))}
        value={descriptor.out(values[field]!)}
        className={
          $c('w-full', {
            'border-error': hasError(props.field)
          })
        }
      />
    )
  }

  const inputProps: CustomInputProps<Values[Field]> = omit(props, formProps.concat('type'));
  return descriptor.input(inputProps);
};

const FormInput = <Values extends Keyed, Field extends StringKey<Values>>(props: FormInputProps<Values, Field>) => {
  const { field, validator } = props;
  const { setValidator, getError, setOmitValidation } = useContext<IFormContext<Values>>(FormContext);
  const error = getError(field)?.message;

  useEffect(() => {
    if(validator) { setValidator(field, validator); }
    if(props.omit) { setOmitValidation(field, props.omit); }
  }, [])

  return (
  <main>
    <Split
      nowrap={props.nowrap}
      left={ <label>{ props.label }</label> }
      right={ getInput(props) }
    />

    <section className={"min-h-[20px] text-right text-error text-sm"}>
      { error }
    </section>
  </main>
  )
}

export default FormInput;
