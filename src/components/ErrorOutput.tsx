import {useContext} from "react";
import {ErrorContext} from "../providers/ErrorProvider";

interface ErrorOutputProps {
  field?: string;
}
const ErrorOutput = ({ field }: ErrorOutputProps) => {
  const { hasError, getError } = useContext(ErrorContext);
  const error = getError(field);

  if(!hasError(field) || !error) {
    return <></>;
  }

  return (
    <main className="text-error text-sm">
      { error.message }
    </main>
  )
};


export default ErrorOutput;
