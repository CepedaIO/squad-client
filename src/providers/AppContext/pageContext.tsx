import {useEffect, useState} from "react";
import debounce from "lodash.debounce";
import {IErrorContext} from "./errorContext";
import {DateTime} from "luxon";

type Values = string | number | DateTime;
export interface ValidationDescriptor<T> {
  _id: string;
  _guard: (obj: any) => obj is T;
  _transformInput?: (val: string) => T;
  _undefined: string;
}

export type FieldValidation<T> = [ValidationDescriptor<T>, ...Validator<T>[]]

export interface IPageContext {
  values: Keyed<Values>;
  errors: Keyed<string[]>;
  onChange: <T>(field: string, val: T) => void;
  addValidation: <T>(field: string, validators: FieldValidation<T>) => void;
  validate: (fields?:string[]) => boolean;
}

const pageContext = ({ addErrors, removeErrors }: IErrorContext): IPageContext => {
  const [valuesMap, setValuesMap] = useState<Keyed<Values>>({});
  const [validatorsMap, setValidatorsMap] = useState<Keyed<Validator<any>[]>>({});
  const [descriptorMap, setDescriptorMap] = useState<Keyed<ValidationDescriptor<any>>>({});
  const [errorsMap, setErrors] = useState<Keyed<string[]>>({});

  const defined:(field: string) => Validator<any> = (field: string) => ({
    id: 'Undefined Value',
    valid: (val?: any) => !!val,
    message: descriptorMap[field]._undefined
  });

  useEffect(() => {
    Object.entries(valuesMap)
      .filter(([field]) => !!validatorsMap[field])
      .map(([field, value]) => [
        field,
        [defined(field)].concat(validatorsMap[field]!)
          .reduce((res, validator) => [
            ...res,
            [validator.valid(value), validator]
          ], [] as [boolean, Validator<any>][])
      ] as [string, [boolean, Validator<any>][]])
    .forEach((record) => {
      debugger;
    })
      .forEach(([field, results]) => setErrors(prev => ({
        ...prev,
        [field]: results.filter(([valid]) => !valid).map(([_, validator]) => validator.message)
      })))
  }, [valuesMap]);

  useEffect(() => {
    Object.entries(errorsMap).forEach(([field, errors]) => {
      if(errors.length > 0) {
        addErrors(errors.map((message) => ({
          field,
          message
        })));
      } else {
        removeErrors(field);
      }
    });
  }, [errorsMap]);

  const onChange = debounce(
    (field, value: any) => {
      const descriptor = descriptorMap[field];

      if(descriptor._transformInput) {
        value = descriptor._transformInput(value);
      }

      if(!descriptor._guard(value)) {
        throw new Error(`Invalid input for: ${descriptor._id}`);
      }

      setValuesMap(prev => ({
        ...prev,
        [field]: value,
      }))
    },
    500
  );

  const addValidation = <T,>(field: string, validation: FieldValidation<T>) => {
    const [descriptor, ...validators] = validation;

    if(field === 'start') {
      debugger;
    }

    setDescriptorMap(prev => ({
      ...prev,
      [field]: descriptor
    }));

    setValidatorsMap(prev => ({
      ...prev,
      [field]: validators,
    }));
  }

  const validate = (fields:string[] = []): boolean =>
    Object.entries(validatorsMap)
      .filter(([field]) => fields.length === 0 || fields.includes(field))
      .map(([field, value]) => [
        field,
        [defined(field)].concat(validatorsMap[field]!)
        .reduce((res, validator) =>
        res.concat([validator.valid(value), validator]),
        [] as [boolean, Validator<any>][])
      ] as [string, [boolean, Validator<any>][]])
      .forEach(([field, results]) => setErrors(prev => ({
        ...prev,
        [field]: results.filter(([valid]) => !valid).map(([_, validator]) => validator.message)
      })))
      .some(([_, results]) => results.length > 0);

  return {
    values: valuesMap,
    errors: errorsMap,
    onChange,
    addValidation,
    validate
  };
}

export default pageContext;
