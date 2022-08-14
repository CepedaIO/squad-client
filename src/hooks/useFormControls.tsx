import {DependencyList, useCallback, useContext, useEffect, useMemo} from "react";
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
  validator?: Validator<Values, Field> | [Validator<Values, Field>, DependencyList]
  omit?: (values: Partial<Values>) => boolean;
} & ControlInputProps<Values[Field]>;

export const useFormControls = <Values extends Keyed>() => {
  const FormInput = useCallback(<Field extends StringKey<Values>>(props: FormControlProps<Values, Field>) => {
    const { field, validator } = props;
    const { setValidator, getError, setOmitValidation, values, setValue } = useContext<IFormContext<Values>>(FormContext);

    const error = getError(field)?.message;
    const dependencies = Array.isArray(validator) ? validator[1] : [];

    useEffect(() => {
      if(validator) {
        setValidator(field, Array.isArray(validator) ? validator[0] : validator);
      }
      if(props.omit) { setOmitValidation(field, props.omit); }
    }, dependencies)

    return useMemo(() => {
      const _props = {
        ...omit(props, ['field', 'validator', 'omit']),
        error,
        value: values[props.field] ?? props.value,
        onChange: (value: Values[Field]) => setValue(field, () => value)
      };

      return <ControlInput {..._props} />
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

