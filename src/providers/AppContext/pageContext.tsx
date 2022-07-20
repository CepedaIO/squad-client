import {useEffect, useState} from "react";
import debounce from "lodash.debounce";
import {Validator, ValidatorResult} from "../../services/validate";
import {IErrorContext} from "./errorContext";
import {DateTime} from "luxon";

type Values = string | number | DateTime;

export interface IPageContext {
  values: Keyed<Values>;
  results: Keyed<ValidatorResult[]>;
  onChange: <T>(field: string, val: T) => void;
  addValidators: <T>(field: string, validators: Validator<T>[]) => void;
  validate: (fields:string[]) => void;
}

const pageContext = ({ addErrors, removeErrors }: IErrorContext): IPageContext => {
  const [valuesMap, setValuesMap] = useState<Keyed<Values>>({});
  const [validatorsMap, setValidatorsMap] = useState<Keyed<Validator[]>>({});
  const [resultsMap, setValidatorResults] = useState<Keyed<ValidatorResult[]>>({});

  useEffect(() => {
    Object.entries(valuesMap)
      .filter(([field]) => !!validatorsMap[field])
      .map(([field, value]) => [
        field,
        validatorsMap[field]!.reduce((res, validator) =>
          res.concat(validator(value)),
        [] as ValidatorResult[])
      ] as [string, ValidatorResult[]])
      .forEach(([field, result]) => setValidatorResults(prev => ({
        ...prev,
        [field]: result
      })))
  }, [valuesMap]);

  useEffect(() => {
    Object.entries(resultsMap).forEach(([field, results]) => {
      const errored = results.filter((result) => !result.valid);

      if(errored.length > 0) {
        addErrors(errored.map((error) => ({
          field,
          ...error
        })));
      } else {
        removeErrors(field);
      }
    });
  }, [resultsMap]);

  const onChange = debounce(
    (field, value: any) => {
      setValuesMap(prev => ({
        ...prev,
        [field]: value,
      }))
    },
    500
  );

  const addValidators = <T,>(field: string, validators: Validator<T>[]) => {
    setValidatorsMap(prev => ({
      ...prev,
      [field]: validators,
    }));
  }

  const validate = (fields:string[]) => {
    Object.entries(validatorsMap)
      .map(([field, validators]) => [
        field,
        validators.reduce((res, validator) =>
          res.concat(validator(valuesMap[field])),
        [] as ValidatorResult[])
      ] as [string, ValidatorResult[]])
      .forEach(([field, result]) => setValidatorResults(prev => ({
        ...prev,
        [field]: result
      })))
  }

  return {
    values: valuesMap,
    results: resultsMap,
    onChange,
    addValidators,
    validate
  };
}

export default pageContext;
