import ErrorableInput, {ErrorableInputProps} from "./ErrorableInput";
import $c from "classnames";
import omit from "lodash.omit";

export interface FormInputProps<Values extends Keyed, Field extends keyof Values & string> extends ErrorableInputProps<Values[Field]>{
  field: Field;
  validation?: (value: Values[Field], values: Values) => void;
  label: string;
  nowrap?: boolean;
}

const FormInput = <Values extends Keyed, Field extends keyof Values & string>(props: FormInputProps<Values, Field>) => {
  const errorInputProps = omit(props, ['label', 'nowrap']);

  return (
  <main className={$c({
    'col-to-row grow-children': props.nowrap,
    'flex flex-col': !props.nowrap
  })}>
    <label className={$c({
      'md:w-1/3': props.nowrap
    })}>{ props.label }</label>

    <ErrorableInput
    { ...errorInputProps }
    className={$c({
      'md:w-2/3': props.nowrap
    })}
    />
  </main>
  )
}

export default FormInput;
