import {createContext, useCallback, useEffect, useState} from "react";
import debounce from "lodash.debounce";
import {useApp} from "../hooks/useApp";

export interface IFormContext<Values extends Keyed> {
  values: Partial<Values>;
  errors: {
    [Field in keyof Values]?: string
  };
  onChange: <Field extends keyof Values>(field: Field, val: Values[Field]) => void;
  setValidator: <Field extends keyof Values>(field: Field, validators: Validator<Values, Field>) => void;
  validate: (fields?:string[]) => boolean;
}

const FormContext = createContext<IFormContext<any>>({
  values: {},
  errors: {},
  onChange: () => {},
  setValidator: () => {},
  validate: () => false
});

FormContext.displayName='Form';

export const createFormContext = <Values extends Keyed>(initialValues:Partial<Values>): IFormContext<Values> => {
  const {
    err: { addErrors, removeErrors }
  } = useApp();
  const [values, setValuesMap] = useState<Partial<Values>>(initialValues);
  const [validators, setValidationMap] = useState<{
    [Field in keyof Values]?: Validator<Values, Field>
  }>({});
  const [errors, setErrors] = useState<{
    [Field in keyof Values]?: string
  }>({});

  useEffect(() => {
    Object.entries(errors).forEach(([field, error]) => {
      if(error) {
        addErrors([
          { field, message:error }
        ])
      } else {
        removeErrors(field);
      }
    });
  }, [errors]);

  const setValidator = useCallback(<Field extends keyof Values>(field: Field, validator: Validator<Values, Field>) => {
    setValidationMap(prev => {
      if(prev[field]) {
        return prev;
      }

      return {
        ...prev,
        [field]: validator,
      };
    });
  }, []);

  const validate = useCallback((fields:(keyof Values)[] = []): boolean =>
    Object.entries(validators)
      .filter(([field]) => fields.length === 0 || fields.includes(field))
      .map(([field, validator]) => {
        const value = values[field];
        const error = validator(value, {
          field,
          values
        });

        setErrors(prev => ({
          ...prev,
          [field]: error ? [error] : null
        }))

        return [
          field,
          error
        ] as Tuple<string, string | null | undefined>
      })
      .some(([_, error]) => !!error)
    , [validators]);

  const onChange = useCallback(debounce(
    <Field extends keyof Values>(field: Field, value: Values[Field]) => {
      setValuesMap(prev => ({
        ...prev,
        [field]: value,
      }));

      validate([field]);
    }, 250)
  , []);

  return {
    values,
    errors,
    onChange,
    setValidator,
    validate
  };
}

export default FormContext;
