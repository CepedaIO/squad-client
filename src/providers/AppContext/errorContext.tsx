import {useCallback, useState} from "react";

export interface FieldError {
  field: string;
  message: string;
}

export interface IErrorContext {
  errors: FieldError[],
  addErrors: (errors:FieldError[] | FieldError) => void;
  removeErrors: (key?: string | string[]) => void;
  hasError: (key?: string | string[]) => boolean;
  getError: (key?: string) => FieldError | undefined;
}

const errorContext = () => {
  const [errors, setErrors] = useState<FieldError[]>([]);
  const addErrors = useCallback((errors: FieldError | FieldError[]) =>
    ([] as FieldError[])
      .concat(errors)
      .forEach((error) =>
        setErrors((prev) =>
          prev.filter((e) => e.field !== error.field)
            .concat(error)
        )
      )
    , [setErrors]);

  const removeErrors = useCallback((id?: string | string[]) => {
    const ids = Array.isArray(id) ? id : [id];
    setErrors((prev) =>
      prev.filter((error => !ids.includes(error.field)))
    );
  }, [setErrors]);

  const hasError = useCallback(
    (id?: string | string[]) => {
      const ids = Array.isArray(id) ? id : [id];
      return errors.some((error) => ids.includes(error.field))
    }
    , [errors]);

  const getError = useCallback(
  (key?: string) => errors.find((error) => error.field === key)
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
