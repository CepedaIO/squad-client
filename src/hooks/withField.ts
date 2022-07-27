import {useContext} from "react";
import AppContext from "../providers/AppContext";
import {DateTime} from "luxon";

type ValidatorFactory<T> = (params: any) => FieldValidator<T>;

const withField = (field: string) => {
  const { page: {
    values
  } } = useContext(AppContext);

  return <T>(factory: ValidatorFactory<T>, additionalParams?: string | Array<any>): FieldValidator<T> => {
    // @ts-ignore
    const validator = factory.apply(factory, [values[field]].concat(additionalParams || []))

    if(!values[field]) {
      return {
        id: 'undefined field pair',
        valid: () => false,
        message: validator.message
      }
    }
    console.log('field', field, (values[field] as DateTime).toISOTime());

    return validator;
  }
}

export default withField;
