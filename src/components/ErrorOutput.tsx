import {useContext} from "react"
import AppContext from "../providers/AppContext";

interface ErrorOutputProps {
  field?: string;
}
const ErrorOutput = ({ field }: ErrorOutputProps) => {
  const {
    err: { hasError, getError }
  } = useContext(AppContext);
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
