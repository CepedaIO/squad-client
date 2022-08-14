import {useContext, } from "react";
import FormContext from "../providers/FormContext";

const useForm = <Values extends Keyed>() => {
  const { values, validate, setValue } = useContext(FormContext);

  return {
    validate,
    values,
    setValue
  } as {
    validate: (fields?:string[]) => [boolean, Values];
    values: Values;
    setValue: <Field extends StringKey<Values>>(field: Field, setter: (prev: Values[Field]) => Values[Field]) => void;
  }
}

export default useForm;
