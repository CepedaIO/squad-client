import {useContext} from "react";
import {ErrorContext} from "../providers/ErrorProvider";

interface ErrorOutputProps {
  field?: string;
}
const ErrorOutput = ({ field }: ErrorOutputProps) => {
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
