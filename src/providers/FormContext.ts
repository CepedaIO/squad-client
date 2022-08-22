import {createContext, useEffect, useState} from "react";
import {useValidation, ValidateResult} from "event-matcher-shared";
import errorContext, {IErrorContext} from "./AppContext/errorContext";

const NULL_PENDING_VALIDATIONS = { fields: [], options: {} };
type OmitValidation<Values extends Keyed> = (values:Values) => boolean;
interface ValidateOptions {
  stopOnFirstFail?: boolean
}

export interface IFormContext<Values extends Keyed> extends Pick<IErrorContext, 'hasError' | 'getError' | 'errors'> {
  values: Values;
  setValue: <Field extends StringKey<Values>>(field: Field, setter: (prev?: Values[Field]) => Values[Field]) => void;
  setValidator: <Field extends StringKey<Values>>(field: Field, validators: Validator<Values, Field>) => void;
  validate: (fields?:StringKey<Values>[]) => ValidateResult<Values>;
  setOmitValidation: (field: StringKey<Values>, omitValidation:OmitValidation<Values>) => void
}

const FormContext = createContext<IFormContext<any>>({
  values: {},
  setValue: () => {},
  setValidator: () => {},
  validate: () => [false, {}, {}],
  hasError: () => false,
  getError: () => undefined,
  errors: [],
  setOmitValidation: () => {}
});
FormContext.displayName='Form';

export const createFormContext = <Values extends Keyed>(initialValues?:Values): IFormContext<Values> => {
  const { addErrors, removeErrors, errors, getError, hasError } = errorContext();
  const [values, setValuesMap] = useState<Values>(initialValues as Values);
  const [pendingValidation, setPendingValidation] = useState<{
    fields: StringKey<Values>[],
    options: ValidateOptions
  }>(NULL_PENDING_VALIDATIONS);
  const [validators, setValidationMap] = useState<{[Field in StringKey<Values>]?: Validator<Values, Field>}>({});
  const [omitValidation, _setOmitValidation] = useState<{[Field in StringKey<Values>]?: OmitValidation<Values>}>({});

  const shouldOmit = (field: StringKey<Values>) => omitValidation[field] && omitValidation[field]!(values);
  const validate = useValidation<Values>({ validators, shouldOmit });

  const concatPendingValidation = <Field extends StringKey<Values>>(field: StringKey<Values> | StringKey<Values>[], options: ValidateOptions = {}) => {
    const fields = Array.isArray(field) ? field : [field];
    const fieldsWithValidators = fields.filter((field) => !!validators[field]);

    if(fieldsWithValidators.length > 0) {
      setPendingValidation(prev => ({
        fields: prev.fields.concat(fieldsWithValidators),
        options: {
          ...prev.options,
          ...options
        }
      }));
    }
  };

  useEffect(() => {
    if(pendingValidation.fields.length > 0) {
      validate(pendingValidation.fields, values, pendingValidation.options);
      setPendingValidation(NULL_PENDING_VALIDATIONS);
    }
  }, [pendingValidation]);

  const setValidator = <Field extends StringKey<Values>>(field: Field, validator: Validator<Values, Field>) => {
    setValidationMap(prev => {
      return {
        ...prev,
        [field]: validator,
      };
    });

    if(typeof values[field] !== 'undefined') {
      concatPendingValidation(field);
    }
  }

  const setOmitValidation = <Field extends StringKey<Values>>(field: Field, omitValidation:OmitValidation<Values>) =>
    _setOmitValidation((prev) => ({
      ...prev,
      [field]: omitValidation
    }));

  const setValue = <Field extends StringKey<Values>>(field: Field, setter:(prev?:Values[Field]) =>
    Values[Field]) => {
      setValuesMap(prev => {
        return {
          ...prev,
          [field]: setter(prev[field])
        }
      });

      concatPendingValidation(field, {
        stopOnFirstFail: true
      });
    };

  const _validate = <Field extends StringKey<Values>>(fields:Field[] = Object.keys(values) as Field[]): ValidateResult<Values> => {
    const [isValid, _values, errors] = validate(fields, values);

    removeErrors(fields);

    if(!isValid) {
      Object.entries(errors).forEach(([field, error]) => addErrors({ field, message: error as string }))
    }

    return [isValid, _values, errors] as ValidateResult<Values>;
  }

  return {
    values,
    setValue,
    setValidator,
    validate: _validate,
    errors,
    hasError,
    getError,
    setOmitValidation
  };
}

export default FormContext;
