import {useContext} from "react";
import {ErrorContext} from "../providers/ErrorProvider";

interface FieldErrorProps {
  name: string;
}

const FieldError = ({
  name
}: FieldErrorProps) => {
  const { hasError } = useContext(ErrorContext);

  const display = hasError(name) ? 'block' : 'none';

  return (
    <main className="text-error text-sm" style={{ display }}>
      This is an error
    </main>
  )
}


export default FieldError;
