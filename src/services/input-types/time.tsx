import {DateTime} from "luxon";
import {InputDescriptor} from "./index";
import {DateTimeValidation} from "squad-shared";
import Input, {InputProps} from "../../components/inline/Input";

const Time: InputDescriptor<DateTime> = {
  id: 'time',
  input: (props: InputProps<'datetime-local'>) => (
    <Input
      {...props}
      type={'datetime-local'}
    />
  ),
  ist: DateTimeValidation.ist
}

export default Time;
