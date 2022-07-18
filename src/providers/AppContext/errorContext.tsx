import {useCallback, useState} from "react";

export interface FieldError {
  key: string;
  message: string;
}

export interface IErrorContext {
  errors: FieldError[],
  addErrors: (errors:FieldError[] | FieldError) => void;
  removeErrors: (key?: string | string[]) => void;
  hasError: (key?: string) => boolean;
  getError: (key?: string) => FieldError | undefined;
}

const errorContext = () => {
  const [errors, setErrors] = useState<FieldError[]>([]);
  const addErrors = useCallback((errors: FieldError | FieldError[]) =>
    ([] as FieldError[])
      .concat(errors)
      .forEach((error) =>
        setErrors((prev) =>
          prev.filter((e) => e.key !== error.key)
            .concat(error)
        )
      )
    , [setErrors]);

  const removeErrors = useCallback((id?: string | string[]) => {
    const ids = Array.isArray(id) ? id : [id];
    setErrors((prev) =>
      prev.filter((error => !ids.includes(error.key)))
    );
  }, [setErrors]);

  const hasError = useCallback(
    (key?: string) => !!key && errors.some((error) => error.key === key)
    , [errors]);

  const getError = useCallback(
  (key?: string) => errors.find((error) => error.key === key)
    , [errors]);

  return {
    errors,
    addErrors,
    removeErrors,
    hasError,
    getError
  };
};

export default errorContext;
