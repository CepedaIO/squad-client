import {createContext, useCallback, useEffect, useState} from "react";
import debounce from "lodash.debounce";
import {useApp} from "../hooks/useApp";

export interface IFormContext<Values extends Keyed> {
  values: Partial<Values>;
  errors: {
    [Field in keyof Values & string]?: string
  };
  onChange: <Field extends keyof Values & string>(field: Field, val: Values[Field]) => void;
  setValidator: <Field extends keyof Values & string>(field: Field, validators: FieldValidator<Values, Field>) => void;
  validate: (fields?:string[]) => ValidateResult<Values>;
}

const FormContext = createContext<IFormContext<any>>({
  values: {},
  errors: {},
  onChange: () => {},
  setValidator: () => {},
  validate: () => [false, {}]
});

FormContext.displayName='Form';

type ValidationError = string;

type ValidateResult<Values extends Keyed> = [true, Values] | [false, {
  [Field in keyof Values]: Values[Field] | ValidationError
}];

export const createFormContext = <Values extends Keyed>(initialValues:Partial<Values>): IFormContext<Values> => {
  const {
    err: { addErrors, removeErrors }
  } = useApp();
  const [values, setValuesMap] = useState<Partial<Values>>(initialValues);
  const [pendingValidation, setPendingValidation] = useState<(keyof Values)[]>([]);
  const [validators, setValidationMap] = useState<{
    [Field in keyof Values & string]?: FieldValidator<Values, Field>
  }>({});
  const [errors, setErrors] = useState<{
    [Field in keyof Values & string]?: string
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

  const setValidator = useCallback(<Field extends keyof Values & string>(field: Field, validator: FieldValidator<Values, Field>) => {
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

  const validate = useCallback((fields:(keyof Values)[] = []): ValidateResult<Values> =>
    Object.entries(validators)
      .filter(([field]) => fields.length === 0 || fields.includes(field))
      .map(([field, validators]) => {
        const value = values[field];
        const ctx = { field, values };

        let valid: boolean = true;
        let error: string = '';
        validators.find((validator: any) => {
          if(Array.isArray(validator)) {
            valid = validator[0](value, ctx);
            error = validator[1];
          } else {
            const tuple = validator(value, ctx);
            valid = tuple[0];
            error = tuple[1];
          }

          return !valid;
        });


        setErrors(prev => ({
          ...prev,
          [field]: !valid ? error : undefined
        }))

        return [
          field,
          valid ? valid : [false, error]
        ] as Tuple<string, true | [false, string]>
      })
    .reduce((res, [field, valid]) => {
      if(valid !== true) {
        res = [false, {
          ...res[1],
          [field]: valid[1]
        }];
      }
      
      return res;
    }, [true, values] as ValidateResult<Values>)
    , [validators, values]);

  const onChange = useCallback(debounce(
    <Field extends keyof Values>(field: Field, value: Values[Field]) => {
      setValuesMap(prev => ({
        ...prev,
        [field]: value,
      }));

      setPendingValidation(prev => prev.concat(field));
    }, 250)
  , []);

  useEffect(() => {
    if(pendingValidation.length > 0) {
      validate(pendingValidation);
      setPendingValidation([]);
    }
  }, [pendingValidation]);

  return {
    values,
    errors,
    onChange,
    setValidator,
    validate
  };
}

export default FormContext;
