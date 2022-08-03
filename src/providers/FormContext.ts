import {createContext, useCallback, useEffect, useState} from "react";
import debounce from "lodash.debounce";
import {useApp} from "../hooks/useApp";
import {ist} from "../services/utils";

export interface IFormContext<Values extends Keyed> {
  values: Partial<Values>;
  errors: {
    [Field in StringKeys<Values>]?: string
  };
  onChange: <Field extends StringKeys<Values>>(field: Field, val: Values[Field]) => void;
  setValidator: <Field extends StringKeys<Values>>(field: Field, validators: Validator<Values, Field>) => void;
  validate: (fields?:string[]) => ValidateResult<Values>;
}

const FormContext = createContext<IFormContext<any>>({
  values: {},
  errors: {},
  onChange: () => {},
  setValidator: () => {},
  validate: () => [false, {}]
});

FormContext.displayName='Form';

type ValidationError = string;

type ValidateResult<Values extends Keyed> = [true, Values] | [false, {
  [Field in StringKeys<Values>]: Values[Field] | ValidationError
}];

interface ValidateOptions {
  stopOnFirstFail?: boolean
}

export const createFormContext = <Values extends Keyed>(initialValues:Partial<Values>): IFormContext<Values> => {
  const {
    err: { addErrors, removeErrors }
  } = useApp();
  const [values, setValuesMap] = useState<Partial<Values>>(initialValues);
  const [pendingValidation, setPendingValidation] = useState<StringKeys<Values>[]>([]);
  const [validators, setValidationMap] = useState<{
    [Field in StringKeys<Values>]?: Validator<Values, Field>
  }>({});
  const [errors, setErrors] = useState<{
    [Field in StringKeys<Values>]?: string
  }>({});
  const [requiredFields, setRequiredFields] = useState<{
    [Field in StringKeys<Values>]?: StringKeys<Values>[]
  }>({});

  useEffect(() => {
    Object.entries(errors).forEach(([field, error]) => {
      if(error) {
        addErrors([
          { field, message:error }
        ])
      } else {
        removeErrors(field);
      }
    });
  }, [errors]);

  useEffect(() => {
    if(pendingValidation.length > 0) {
      validate(pendingValidation, { stopOnFirstFail: true });
      setPendingValidation([]);
    }
  }, [pendingValidation]);

  const setValidator = useCallback(<Field extends StringKeys<Values>>(field: Field, validator: Validator<Values, Field>) => {
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

  const requiredFactory = <Field extends StringKeys<Values>>(field:Field) => (otherField: StringKeys<Values>, additionalAssertions: ValidatorSuite<Values[Field]>): ValidatorSuite<Values[Field]> => {
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
  };

  const runValidator = <Field extends StringKeys<Values>>(field: Field, validator:Validator<Values, Field>): AssertionResult<Values[Field]> =>  {
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
  }

  const _validate = (fields:StringKeys<Values>[] = Object.keys(validators), options: ValidateOptions = {}, result: ValidateResult<Values> = [true, {} as Values]): ValidateResult<Values> => {
    if(fields.length === 0 || (options.stopOnFirstFail && !result[0])) return result;
    const [field, ...nextFields] = fields as [StringKeys<Values>, ...StringKeys<Values>[]];
    const validator = validators[field];

    if(validator) {
      const [isValid, res] = runValidator(field, validator);

      setErrors(prev => ({
        ...prev,
        [field]: !isValid ? res : undefined
      }));

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
  };

  const validate = useCallback((fields:StringKeys<Values>[] = Object.keys(validators), options: ValidateOptions = {}): ValidateResult<Values> => {
    return _validate(fields, options);
  }, [values, validators]);

  const onChange = useCallback(debounce(
    <Field extends StringKeys<Values>>(field: Field, value: Values[Field]) => {
      setValuesMap(prev => ({
        ...prev,
        [field]: value,
      }));

      setPendingValidation(prev => prev.concat(field));
    }, 500)
  , []);

  return {
    values,
    errors,
    onChange,
    setValidator,
    validate
  };
}

export default FormContext;
