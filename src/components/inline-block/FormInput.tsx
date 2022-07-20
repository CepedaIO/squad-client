import ErrorableInput, {ErrorableInputProps} from "./ErrorableInput";
import $c from "classnames";
import {ist} from "../../services/utils";
import omit from "lodash.omit";

type FormInputProps = {
  label: string;
  nowrap?: boolean;
} & ErrorableInputProps;

const FormInput = (props: FormInputProps) => {
  const errorInputProps = omit(props, ['ref', 'label', 'nowrap']);

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
