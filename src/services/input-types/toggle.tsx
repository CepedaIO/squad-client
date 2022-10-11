import {CustomInputDescriptor, CustomInputProps} from "./index";
import {ist} from "../utils";
import Button from "../../components/inline/Button";

const ToggleInput = (props: CustomInputProps<boolean>) => {
  
  return (
    <Button
      variant={'toggle'}
      active={props.value}
      onChange={props.onChange}
    />
  );
};
const Toggle: CustomInputDescriptor<boolean> = {
  id: 'toggle',
  input: ToggleInput,
  ist: ist<boolean>((val) => typeof val === 'boolean')
};

export default Toggle;
