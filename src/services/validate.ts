import {useCallback, useContext, useState} from "react";
import {ErrorContext} from "../providers/ErrorProvider";

interface ValidatorResult<T extends Keyed, K extends keyof T = keyof T & string> {
  key: K;
  valid: boolean;
  message: string;
}

interface ValidatorContext<T extends Keyed> {
  assert: <K extends keyof T & string>(key:K, valid: boolean | ((val:T[K], values: T) => boolean), message: string) => ValidatorResult<T>;
}

export const assert = <T extends Keyed, K extends keyof T = keyof T & string>(key:K, valid: boolean | ((val:T[K], values: T) => boolean), message: string) => ({ valid, message, key });

export const useValidator = () => {
  const [errors, setErrors] = useState<any[]>([]);
  const {addErrors} = useContext(ErrorContext);

  const setup = useCallback(<T extends Keyed>(values: T) => {
    const validate = (results: ValidatorResult<T>[]) => {
      const errors = results.filter(({ key, valid }) => !valid)
      setErrors(() => errors);
      return errors;
    };

    const validateAndReport = (provide: (ctx:ValidatorContext<T>) => ValidatorResult<T>[]) => {
      const results = provide({
        assert: (key, valid, message) => ({
          key,
          message,
          valid: typeof valid === 'function' ? valid(values[key], values) : valid
        })
      })

      debugger;

      addErrors(validate(results));
    };

    return { validate, validateAndReport };
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
