import {useContext, useEffect} from "react";
import FormContext from "../providers/FormContext";
import {FieldError} from "../providers/AppContext/errorContext";

type setValidationReturn<Values extends Keyed, Field extends StringKey<Values>> = [string | undefined, () => [boolean, Values[Field]]];

interface useFormReturn<Values extends Keyed> {
  validate: (fields?:string[]) => [boolean, Values];
  values: Values;
  setValue: <Field extends StringKey<Values>>(field: Field, setter: (prev: Values[Field]) => Values[Field]) => void;
  getError: <Field extends StringKey<Values>>(field: Field) => FieldError | undefined;
  setValidation: <Field extends StringKey<Values>>(field: Field, validator?: Validator<Values, Field>, dependencies?: DependencyList) => setValidationReturn<Values, Field>
}

const useForm = <Values extends Keyed>() => {
  const { values, validate, setValue, setValidator, getError } = useContext(FormContext);

  const setValidation = <Field extends StringKey<Values>>(field: Field, validator?: Validator<Values, Field>, dependencies?: DependencyList) => {
    const { getError } = useContext(FormContext);

    useEffect(() => {
      if(validator) {
        setValidator(field, validator)
        validate([field])
      }
    }, dependencies || []);

    return [getError(field)?.message, () => {
      const result = validate([field]);
      return [result[0], result[1][field]];
    }];
  }

  return {
    validate,
    values,
    setValue,
    getError,
    setValidation
  } as useFormReturn<Values>
}

export default useForm;
