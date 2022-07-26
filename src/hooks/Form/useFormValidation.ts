import {useForm} from "../useForm";

interface SuiteActions<Values> {
  values: Partial<Values>;
  userError: (message:string) => void;
}

type Suite<Values, Field extends keyof Values> = (value: Values[Field], actions: SuiteActions<Values>) => void;
type FieldSuites<Values> = {
  [Field in keyof Values]?: Suite<Values, Field>
}
type FieldErrors<Values> = { [Field in keyof Values]?: string[] }
type ValidationHook<Values> = (suites: FieldSuites<Values>) => ValidationResult<Values>;
type ValidationResult<Values> = [Partial<Values>, FieldErrors<Values>]

const useFormValidation = <Values extends Keyed>(suites: {
  [Field in keyof Values]?: Suite<Values, Field>
}) => {
  const [values] = useForm<Values>();

  return Object.entries(suites).reduce((result, [field, suite]) => {
    const key = field as keyof Values;
    const resolve = 0;
    const reject = 1;

    suite(values[key], {
      values,
      userError: (message: string) => {
        if(!result[reject][key]) result[reject][key] = [];
        result[reject][key]!.push(message);
      }
    });

    if(!result[resolve][key]) result[resolve][key] = values[key];

    return result;
  }, [{}, {}] as ValidationResult<Values>);
};

const useValidationFactory = <Values extends Keyed>(values: Values): ValidationHook<Values> => useFormValidation<Values>;

export default useFormValidation;
