import {useCallback, useContext, useEffect} from "react";
import FormContext from "../../providers/FormContext";
import FormInput, {FormInputProps} from "./FormInput";
import Button, {ToggleButtonProps} from "../../components/inline/Button";

interface FormToggleProps<Values extends Keyed> extends Omit<ToggleButtonProps, 'variant'> {
  field: StringKey<Values, boolean>;
}

const useForm = <Values extends Keyed>(initialValues?: Partial<Values>) => {
  const { values, validate, onChange, setValues } = useContext(FormContext);

  useEffect(() => {
    if(initialValues) setValues(initialValues);
  },[]);

  const _FormInput = useCallback(<Field extends StringKey<Values>>(props: Omit<FormInputProps<Values, Field>, 'values'>) => (
    <FormInput
      { ...props }
    />
  ), []);

  const FormToggle = useCallback((props: FormToggleProps<Values>) => (
    <Button
      { ...props }
      variant={"toggle"}
      active={values[props.field]}
      onChange={ (value: boolean) => onChange(props.field, value)}
    />
  ), [values]);


  return {
    validate,
    values,
    FormInput: _FormInput,
    FormToggle
  } as {
    validate: (fields?:string[]) => [false, Partial<Values>];
    FormInput: typeof _FormInput;
    FormToggle: typeof FormToggle;
    values: Partial<Values>;
  } | {
    validate: (fields?: string[]) => [true, Values];
    FormInput: typeof _FormInput;
    FormToggle: typeof FormToggle;
    values: Values;
  };
}

export default useForm;
