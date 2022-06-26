import {Dispatch, SetStateAction, useCallback, useContext, useState} from "react";
import {ErrorContext, FieldError} from "../providers/ErrorProvider";

interface ValidatorResult<T extends Keyed, K extends keyof T = keyof T & string> {
  key: K;
  valid: boolean;
  message: string;
}

interface ValidatorContext<T extends Keyed> {
  assert: <K extends keyof T & string>(key:K, valid: boolean | ((val:T[K], values: T) => boolean), message: string) => ValidatorResult<T>;
}

export const useValidator = () => {
  const [errors, setErrors] = useState<any[]>([]);
  const {addErrors, removeErrors} = useContext(ErrorContext);

  const setup = useCallback(<T extends Keyed>(values: T) => {
    removeErrors(Object.keys(values));

    const validate = (results: ValidatorResult<T>[]) => {
      const errors = results.filter(({ key, valid }) => !valid)
      setErrors(() => errors);
      return errors;
    };

    const validateAndReport = (provide: (ctx:ValidatorContext<T>) => ValidatorResult<T>[]): Promise<T> => {
      const results = provide({
        assert: (key, valid, message) => ({
          key,
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

  const validate = useCallback(<T>(tests: ValidatorResult<T>[]) =>{
    const errors = tests.filter(({ valid }) => !valid);
    setErrors(() => errors);
    return errors;
  }, []);

  const validateAndReport = useCallback(
    <T extends Keyed>(tests: ValidatorResult<T>[]) => addErrors(validate(tests))
  , []);

  return { errors, validate, validateAndReport, setup };
}
