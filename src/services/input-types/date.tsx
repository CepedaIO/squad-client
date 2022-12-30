import {DateTime} from "luxon";
import {DateTimeValidation} from "squad-shared";
import {InputDescriptor} from "./index";
import Input from "../../components/inline/Input";
import $c from "classnames";

const Date:InputDescriptor<DateTime> = {
  id: 'date',
  input: (props) => {
    const value = DateTimeValidation.ist(props.value) ? Date.out!(props.value) : props.value;
    const onChange = (value: string | null) =>
      props.onChange && props.onChange(Date.in!(value));
  
    return <Input
      {...props}
      type={'date'}
      value={value}
      className={$c(props.className, 'p-2')}
      onChange={onChange}
    />
  },
  ist: DateTimeValidation.ist,
  out: (val: DateTime) => val.toFormat('yyyy-LL-dd'),
  in: (val: any) => DateTime.fromISO(val),
};

export default Date;
