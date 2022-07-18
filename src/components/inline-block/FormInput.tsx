import ErrorableInput, {ErrorableInputProps} from "./ErrorableInput";
import $c from "classnames";
import {ist} from "../../services/utils";

type FormInputProps = {
  label: string;
  nowrap?: boolean;
} & ErrorableInputProps;

type FormInputSlotProps = {
  slots: {
    label: JSX.Element;
    input: JSX.Element;
  }
} & ErrorableInputProps;


const FormInput = (props: FormInputProps | FormInputSlotProps) => {
  const {
    field, type, validate
  } = props;

  if(ist<FormInputSlotProps>((obj) => !!obj.slots)(props)) {
    return (
      <main className={$c('flex flex-col')}>
        { props.slots.label }
        <ErrorableInput field={field} type={type} input={props.slots.input} validate={validate} />
      </main>
    )
  }

  return (
    <main className={$c({
      'col-to-row grow-children': props.nowrap,
      'flex flex-col': !props.nowrap
    })}>
      <label className={$c({
        'md:w-1/3': props.nowrap
      })}>{ props.label }</label>

      <ErrorableInput field={field} type={type} validate={validate} className={$c({
        'md:w-2/3': props.nowrap
      })}/>
    </main>
  )
}

export default FormInput;
