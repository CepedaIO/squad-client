import {DateTime} from "luxon";
import {InputDescriptor} from "./index";
import DateAndTime from "./datetime";

const Time: InputDescriptor<DateTime> = {
  id: 'time',
  input: 'time',
  in: (val: string) => DateTime.fromFormat(val, 'HH:mm'),
  out: (val: DateTime) => val.toFormat('HH:mm'),
  ist: DateAndTime.ist
}

export default Time;
