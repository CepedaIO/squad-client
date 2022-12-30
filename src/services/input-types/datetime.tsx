import {DateTime} from "luxon";
import {InputDescriptor} from "./index";
import {DateTimeValidation} from "squad-shared";
import Input, {InputProps} from "../../components/inline/Input";

export const DateAndTime: InputDescriptor<DateTime> = {
  id: 'datetime',
  input: (props: InputProps<'datetime-local'>) => {
    const value = DateTimeValidation.ist(props.value) ? props.value.toFormat('yyyy-LL-dd\'T\'HH:mm') : props.value;
    console.log(value);
    const onChange = (value: string | null) =>
      // @ts-ignore
      props.onChange && props.onChange(DateTime.fromISO(value));
    
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
  ist: DateTimeValidation.ist
};

export default DateAndTime;
