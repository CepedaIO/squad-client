import {DateTime} from "luxon";
import {InputDescriptor} from "./index";
import {DateTimeValidation} from "squad-shared";
import Input from "../../components/inline/Input";

export const DateAndTime: InputDescriptor<DateTime> = {
  id: 'datetime',
  input: (props) => {
    const value = DateTimeValidation.ist(props.value) ? DateAndTime.out!(props.value) : props.value;
    const onChange = (value: string | null) =>
      props.onChange && props.onChange(DateAndTime.in!(value));
    
    return (
      <Input
        {...props}
        value={value}
        type={'datetime-local'}
        onChange={onChange}
      />
    )
  },
  out: (value:DateTime) => value.toFormat('yyyy-LL-dd\'T\'HH:mm'),
  in: (value: any) => DateTime.fromISO(value),
  ist: DateTimeValidation.ist
};

export default DateAndTime;
