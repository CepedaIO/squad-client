import {useContext, useEffect} from "react";
import FormContext from "../providers/FormContext";

const useForm = <Values extends Keyed>(initialValues?: Partial<Values>) => {
  const { values, validate, setValues } = useContext(FormContext);

  useEffect(() => {
    if(initialValues) setValues(initialValues);
  },[]);

  return {
    validate,
    values
  } as {
    validate: (fields?:string[]) => [false, Partial<Values>];
    values: Partial<Values>;
  } | {
    validate: (fields?: string[]) => [true, Values];
    values: Values;
  };
}

export default useForm;
