import ErrorableInput from "./ErrorableInput";
import $c from "classnames";
import {InputProps} from "../inline/Input";
import {ist} from "../../services/utils";

type FormInputProps = {
  label: string;
  nowrap?: boolean;
} & InputProps;

type FormInputSlotProps = {
  slots: {
    label: JSX.Element;
    input: JSX.Element;
  }
} & InputProps;


const FormInput = (props: FormInputProps | FormInputSlotProps) => {
  const {
    field, type
  } = props;



  if(ist<FormInputSlotProps>((obj) => !!obj.slots)(props)) {
    return (
      <main className={$c('flex flex-col')}>
        { props.slots.label }
        <ErrorableInput field={field} type={type} input={props.slots.input} />
      </main>
    )
  }

  return (
    <main className={$c('col-to-row')}>
      <label>{ props.label }</label>
      <ErrorableInput field={field} type={type}  />
    </main>
  )
}

export default FormInput;
