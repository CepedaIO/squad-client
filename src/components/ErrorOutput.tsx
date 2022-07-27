import {useContext} from "react"
import AppContext from "../providers/AppContext";
import $c from "classnames";

interface ErrorOutputProps {
  field?: string;
  className?: string;
}
const ErrorOutput = ({ field, className }: ErrorOutputProps) => {
  const {
    err: { hasError, getError }
  } = useContext(AppContext);
  const error = getError(field);

  if(!hasError(field) || !error) {
    return <></>;
  }

  return (
    <main className={$c(className, "text-error text-sm")}>
      { error.message }
    </main>
  )
};


export default ErrorOutput;
