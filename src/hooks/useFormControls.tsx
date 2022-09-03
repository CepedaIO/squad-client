import {useCallback, useContext, useMemo} from "react";
import ControlInput, {AdapterInputProps, InjectedInputProps} from "../components/ControlInput";
import Button, {ToggleButtonProps} from "../components/inline/Button";
import FormContext from "../providers/FormContext";
import {omit} from "lodash";
import useForm from "./useForm";
import {SimpleInputTypes} from "../components/inline/Input";

interface FormToggleProps<Values extends Keyed, Field extends StringKey<Values, boolean>> extends Omit<ToggleButtonProps, 'variant'> {
  field: Field;
  validator?: ValidatorAsProp<Values, Field>;
  omit?: (values: Partial<Values>) => boolean;
}

export interface AdapterFormControlProps<Values extends Keyed, Field extends StringKey<Values>> extends AdapterInputProps<Values[Field]> {
  field: Field;
  validator?: ValidatorAsProp<Values, Field>
  omit?: (values: Partial<Values>) => boolean;
}

export interface InjectedFormControlProps<Values extends Keyed, Field extends StringKey<Values>> extends InjectedInputProps<Values[Field]> {
  field: Field;
  validator?: ValidatorAsProp<Values, Field>
  omit?: (values: Partial<Values>) => boolean;
}

export type FormControlProps<Values extends Keyed, Field extends StringKey<Values>> = Values[Field] extends SimpleInputTypes ? AdapterFormControlProps<Values, Field> : InjectedFormControlProps<Values, Field>;

export const useFormControls = <Values extends Keyed>() => {
  const FormInput = useCallback(<Field extends StringKey<Values>>(props: FormControlProps<Values, Field>) => {
    const { field, validator, type } = props;
    const { values, setValue, setValidation } = useForm<Values>()

    const dependencies = Array.isArray(validator) ? validator[1] : [];
    const _validator = Array.isArray(validator) ? validator[0] : validator;

    const [error] = setValidation(field, {
      validator: _validator,
      ist: type.ist
    }, dependencies);

    return useMemo(() => {
      const _props = {
        ...omit(props, ['field', 'validator', 'omit']),
        error,
        value: values[props.field] ?? props.value,
        onChange: (value: Values[Field]) => {
          setValue(field, () => value)
        }
      };

      // @ts-ignore
      return <ControlInput {..._props} data-cy={props.field} />
    }, [values[field], error, props])
  }, []);

  const FormToggle = useCallback(<Field extends StringKey<Values>>(props: FormToggleProps<Values, Field>) => {
    const { values, setValue } = useContext(FormContext);
    return (
      <Button
        { ...props }
        variant={"toggle"}
        active={values[props.field]}
        onChange={ (value: boolean) => setValue(props.field, () => value)}
      />
    );
  }, []);

  return { FormInput, FormToggle };
};

