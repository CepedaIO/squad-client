import FormInput, {FormInputProps} from "../../components/inline-block/FormInput";

const useFormControls = <Values,>(values: Values) => {

  return <Field extends keyof Values & string>(props: Omit<FormInputProps<Values, Field>, 'values'>) => {
    return (
    <FormInput
    { ...props }
    values={values}
    />
    );
  }
}

export default useFormControls;
