import {createContext, useCallback, useEffect, useState} from "react";
import {ist} from "../services/utils";
import {omitBy, isUndefined} from "lodash";
import errorContext, {IErrorContext} from "./AppContext/errorContext";

type OmitValidation<Values extends Keyed> = (values:Partial<Values>) => boolean;

export interface IFormContext<Values extends Keyed> extends Pick<IErrorContext, 'hasError' | 'getError' | 'errors'> {
  values: Partial<Values>;
  setValues: (values:Partial<Values>) => void;
  onChange: <Field extends StringKey<Values>>(field: Field, val: Values[Field]) => void;
  setValidator: <Field extends StringKey<Values>>(field: Field, validators: Validator<Values, Field>) => void;
  validate: (fields?:StringKey<Values>[]) => ValidateResult<Values>;
  setOmitValidation: (field: StringKey<Values>, omitValidation:OmitValidation<Values>) => void
}

const FormContext = createContext<IFormContext<any>>({
  values: {},
  setValues: () => {},
  onChange: () => {},
  setValidator: () => {},
  validate: () => [false, {}],
  hasError: () => false,
  getError: () => undefined,
  errors: [],
  setOmitValidation: () => {}
});

FormContext.displayName='Form';

type ValidationError = string;

type ValidateResult<Values extends Keyed> = [true, Values] | [false, {
  [Field in StringKey<Values>]: Values[Field] | ValidationError
}];

interface ValidateOptions {
  stopOnFirstFail?: boolean
}

export const createFormContext = <Values extends Keyed>(initialValues:Partial<Values>): IFormContext<Values> => {
  const { addErrors, removeErrors, errors, getError, hasError } = errorContext();
  const [values, setValuesMap] = useState<Partial<Values>>(initialValues);
  const [pendingValidation, setPendingValidation] = useState<StringKey<Values>[]>([]);
  const [validators, setValidationMap] = useState<{
    [Field in StringKey<Values>]?: Validator<Values, Field>
  }>({});
  const [requiredFields, setRequiredFields] = useState<{
    [Field in StringKey<Values>]?: StringKey<Values>[]
  }>({});
  const [omitValidation, setOmitValidation] = useState<{
    [Field in StringKey<Values>]?: OmitValidation<Values>
  }>({});

  useEffect(() => {
    if(pendingValidation.length > 0) {
      validate(pendingValidation, { stopOnFirstFail: true });
      setPendingValidation([]);
    }
  }, [pendingValidation]);

  const setValidator = useCallback(<Field extends StringKey<Values>>(field: Field, validator: Validator<Values, Field>) => {
    setValidationMap(prev => {
      if(prev[field]) {
        return prev;
      }

      return {
        ...prev,
        [field]: validator,
      };
    });
  }, []);

  const _setOmitValidation = useCallback(<Field extends StringKey<Values>>(field: Field, omitValidation:OmitValidation<Values>) => setOmitValidation((prev) => ({
    ...prev,
    [field]: omitValidation
  })), []);

  const requiredFactory = useCallback(<Field extends StringKey<Values>>(field:Field) => (otherField: StringKey<Values>, additionalAssertions: ValidatorSuite<Values[Field]>): ValidatorSuite<Values[Field]> => {
    setRequiredFields((prev) => {
      if(!prev[otherField]) prev[otherField] = [];
      if(!prev[otherField]!.includes(field)) {
        return {
          ...prev,
          [otherField]: prev[otherField]!.concat(field)
        };
      }

      return prev;
    });

    return values[otherField] ? additionalAssertions : [];
  }, [values]);

  const runValidator = useCallback(<Field extends StringKey<Values>>(field: Field, validator:Validator<Values, Field>): AssertionResult<Values[Field]> =>  {
    const value = values[field];
    const required = requiredFactory(field);
    const isAssertionWithMessage = ist<AssertionWithMessage<Values[Field]>>((obj:any) =>
      Array.isArray(obj)
      && typeof obj[0] === 'function'
      && typeof obj[1] === 'string'
    );

    const runSuite = (field: Field, assertions: ValidatorSuite<Values[Field]>): AssertionResult<Values[Field]> => {
      if(assertions.length === 0) return [true, value!];

      const [assertion, ...nextAssertions] = assertions;

      if(isAssertionWithMessage(assertion)) {
        const [assert, message] = assertion;
        const isValid = assert(value!);
        if(!isValid) return [false, message];
      } else {
        nextAssertions.unshift.apply(nextAssertions, assertion);
      }

      return nextAssertions.length > 0 ? runSuite(field, nextAssertions) : [true, value!];
    }

    const assertions = validator(values as Values, { field, value, required });
    return runSuite(field, assertions);
  }, [values]);

  const shouldOmit = (field: StringKey<Values>) => omitValidation[field] && omitValidation[field]!(values);

  const _validate = useCallback((fields:StringKey<Values>[] = Object.keys(validators), options: ValidateOptions = {}, result: ValidateResult<Values> = [true, {} as Values]): ValidateResult<Values> => {
    if(fields.length === 0 || (options.stopOnFirstFail && !result[0])) return result;
    const [field, ...nextFields] = fields as [StringKey<Values>, ...StringKey<Values>[]];
    const validator = validators[field];

    if(validator && !shouldOmit(field)) {
      const [isValid, res] = runValidator(field, validator);

      isValid ? removeErrors(field) : addErrors({ field, message: res });

      if(requiredFields[field]) {
        const definedFields = Object.keys(result[1]).concat(fields);
        const _fields = requiredFields[field]!.filter((field) => !definedFields.includes(field));
        nextFields.push.apply(nextFields, _fields);
      }

      return _validate(nextFields, options,[isValid && result[0], {
        ...result[1],
        [field]: res
      }] as ValidateResult<Values>);
    }

    return _validate(nextFields, options, result);
  }, [values, validators]);

  const validate = useCallback((fields:StringKey<Values>[] = Object.keys(validators), options: ValidateOptions = {}): ValidateResult<Values> => {
    const [isValid, values] = _validate(fields, options);
    return [isValid, omitBy(values, isUndefined)] as ValidateResult<Values>;
  }, [values, validators]);

  const onChange = useCallback(
    <Field extends StringKey<Values>>(field: Field, value: Values[Field]) => {
      debugger;
      setValuesMap(prev => ({
        ...prev,
        [field]: value,
      }));

      setPendingValidation(prev => prev.concat(field));
    }
  , []);

  const setValues = useCallback((values: Partial<Values>) => setValuesMap((prev) => ({
    ...prev,
    ...values
  })), []);

  return {
    values,
    setValues,
    onChange,
    setValidator,
    validate,
    errors,
    hasError,
    getError,
    setOmitValidation: _setOmitValidation
  };
}

export default FormContext;
