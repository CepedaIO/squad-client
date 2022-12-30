import {DateTime} from "luxon";
import {InputDescriptor} from "./index";
import {DateTimeValidation} from "squad-shared";
import Input, {InputProps} from "../../components/inline/Input";

const Time: InputDescriptor<DateTime> = {
  id: 'time',
  input: (props) => {
    const value = DateTimeValidation.ist(props.value) ? Time.out!(props.value) : props.value;
    const onChange = (value: string | null) =>
      props.onChange && props.onChange(Time.in!(value));
    
    return <Input
      {...props}
      value={value}
      onChange={onChange}
      type={'datetime-local'}
    />
  },
  ist: DateTimeValidation.ist,
  out: (value: DateTime) => value.toFormat('HH:mm'),
  in: (value: any) => DateTime.fromISO(value),
}

export default Time;
