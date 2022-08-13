import {useCallback, useContext, useEffect, useMemo} from "react";
import ControlInput, {ControlInputProps} from "../components/ControlInput";
import Button, {ToggleButtonProps} from "../components/inline/Button";
import FormContext, {IFormContext} from "../providers/FormContext";
import {omit} from "lodash";

interface FormToggleProps<Values extends Keyed, Field extends StringKey<Values, boolean>> extends Omit<ToggleButtonProps, 'variant'> {
  field: Field;
  validator?: Validator<Values, Field>;
  omit?: (values: Partial<Values>) => boolean;
}

export type FormControlProps<Values extends Keyed, Field extends StringKey<Values>> = {
  field: Field;
  validator?: Validator<Values, Field>;
  omit?: (values: Partial<Values>) => boolean;
} & ControlInputProps<Values[Field]>;

export const useFormControls = <Values extends Keyed>() => {
  const _FormInput = useCallback(<Field extends StringKey<Values>>(props: FormControlProps<Values, Field>) => {
    const { field, validator } = props;
    const { setValidator, getError, setOmitValidation, values, onChange } = useContext<IFormContext<Values>>(FormContext);

    const error = getError(field)?.message;

    useEffect(() => {
      if(validator) { setValidator(field, validator); }
      if(props.omit) { setOmitValidation(field, props.omit); }
    }, [])

    return useMemo(() => {
      const _props = {
        ...omit(props, ['field', 'validator', 'omit']),
        error,
        value: values[props.field] ?? props.value,
        onChange: (value: Values[Field]) => onChange(field, value)
      };

      return <ControlInput {..._props} />
    }, [values[field], error])
  }, []);

  const FormToggle = useCallback(<Field extends StringKey<Values>>(props: FormToggleProps<Values, Field>) => {
    const { values, onChange } = useContext(FormContext);
    return (
      <Button
        { ...props }
        variant={"toggle"}
        active={values[props.field]}
        onChange={ (value: boolean) => onChange(props.field, value)}
      />
    );
  }, []);

  return {
    FormInput: _FormInput,
    FormToggle
  } as {
    FormInput: typeof _FormInput;
    FormToggle: typeof FormToggle;
  } | {
    FormInput: typeof _FormInput;
    FormToggle: typeof FormToggle;
  };
};

