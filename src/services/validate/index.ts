import {useCallback, useContext, useState} from "react";
import AppContext from "../../providers/AppContext";

export interface ValidatorResult {
  valid: boolean;
  message: string;
}

export interface FieldValidation extends ValidatorResult{
  field: string;
}

export type Validator<T = any> = (val:T) => ValidatorResult[];

interface ValidatorContext<T extends Keyed> {
  assert: <K extends keyof T & string>(key:K, valid: boolean | ((val:T[K], values: T) => boolean), message: string) => FieldValidation;
}

export const validateWith = <T,>(
  validators: Validator<T>[]
) => (key:string) => (val:T) => validators.reduce((prev, validator) =>
  prev.concat(
    validator(val).map((res) => ({
      field: key,
      ...res
    }))
  )
, [] as FieldValidation[]);

export const useValidator = <V>() => {
  const [errors, setErrors] = useState<any[]>([]);
  const {
    err: {addErrors, removeErrors}
  } = useContext(AppContext);

  const useValidators = (validators: Validator<V>[]) => (val: V) =>
    validators.map((validator) => validator(val));

  const setup = useCallback(<S extends Keyed>(values: S) => {
    removeErrors(Object.keys(values));

    const validate = (results: FieldValidation[]) => {
      const errors = results.filter(({ field, valid }) => !valid)
      setErrors(() => errors);
      return errors;
    };

    const validateAndReport = (provide: (ctx:ValidatorContext<S>) => FieldValidation[]): Promise<S> => {
      const results = provide({
        assert: (key, valid, message) => ({
          field: key,
          message,
          valid: typeof valid === 'function' ? valid(values[key], values) : valid
        })
      })

      const errors = validate(results);
      addErrors(errors);

      return errors.length === 0 ? Promise.resolve(values) : Promise.reject({ errors, values });
    };

    const effect = (doEffect: () => void) => {
      doEffect();
      return { validate, validateAndReport, effect };
    }

    return { validate, validateAndReport, effect };
  }, []);

  const validate = useCallback((tests: FieldValidation[]) =>{
    const errors = tests.filter(({ valid }) => !valid);
    setErrors(() => errors);
    return errors;
  }, []);

  const validateAndReport = useCallback(
    (tests: FieldValidation[]) => addErrors(validate(tests))
  , []);

  return [useValidators, errors, { validate, validateAndReport, setup }];
}
