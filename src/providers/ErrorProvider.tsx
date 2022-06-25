import {createContext, ReactElement, useCallback, useState} from "react";

interface FieldError {
  key: string;
  message: string;
}

interface ErrorProviderProps {
  children: ReactElement
}

interface IErrorContext {
  errors: FieldError[],
  addErrors: (errors:FieldError[] | FieldError) => void;
  removeError: (key: string) => void;
  hasError: (key?: string) => boolean;
  getError: (key: string) => FieldError | undefined;
}

export const ErrorContext = createContext<IErrorContext>({} as IErrorContext);

const ErrorProvider = ({
  children
}: ErrorProviderProps) => {
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
    , [errors]);

  const removeError = useCallback((id: string) =>
      setErrors((prev) => prev.filter((n) => n.key !== id))
    , [errors]);

  const hasError = useCallback(
    (key?: string) => !!key && errors.some((error) => error.key === key)
    , [errors]);

  const getError = useCallback(
  (key: string) => errors.find((error) => error.key === key)
    , [errors]);

  return (
    <ErrorContext.Provider value={{
      errors,
      addErrors,
      removeError,
      hasError,
      getError
    }}>
      { children }
    </ErrorContext.Provider>
  )
};

export default ErrorProvider;
