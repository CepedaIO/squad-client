import {useContext} from "react";
import {ErrorContext} from "../providers/ErrorProvider";
import {ErrorZoneContext} from "./ErrorZone";

const ErrorOutput = () => {
  const { field } = useContext(ErrorZoneContext);
  const { hasError, getError } = useContext(ErrorContext);

  const display = hasError(field) ? 'block' : 'none';
  const error = getError(field);

  if(!error) {
    return <></>;
  }

  return (
    <main className="text-error text-sm" style={{ display }}>
      { error.message }
    </main>
  )
};


export default ErrorOutput;
