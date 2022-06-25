import {createContext, ReactElement, useContext} from "react";
import {ErrorContext} from "../providers/ErrorProvider";
import cc from 'classnames';
import c from './ErrorZone.module.pcss';

interface IErrorZoneContext {
  field: string;
  message?: string;
}

interface ErrorZoneProps {
  field: string;
  children: ReactElement[]
}

export const ErrorZoneContext = createContext<IErrorZoneContext>({
  field: ''
});

export const ErrorZone = ({ field, children }: ErrorZoneProps) => {
  const {hasError} = useContext(ErrorContext);

  return (
    <ErrorZoneContext.Provider value={{ field }}>
      <section className={cc({
        [c.errored]: hasError(field)
      })}>
        { children }
      </section>
    </ErrorZoneContext.Provider>
  )
}
