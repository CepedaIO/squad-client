import {useCallback, useContext} from "react";
import FormContext from "../../providers/FormContext";
import FormInput, {FormInputProps} from "./FormInput";

const useForm = <Values,>() => {
  const { values, validate } = useContext(FormContext);

  const _FormInput = useCallback(<Field extends StringKeys<Values>>(props: Omit<FormInputProps<Values, Field>, 'values'>) => (
    <FormInput
      { ...props }
    />
  ), []);

  return {
    validate,
    values,
    FormInput: _FormInput
  } as {
    validate: (fields?:string[]) => [false, Partial<Values>],
    FormInput: typeof _FormInput
    values: Partial<Values>
  } | {
    validate: (fields?: string[]) => [true, Values],
    FormInput: typeof _FormInput
    values: Values
  };
}

export default useForm;
