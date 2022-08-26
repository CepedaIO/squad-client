import {DateTime} from "luxon";
import {DateAndTime} from "./datetime";
import {InputDescriptor} from "./index";

const Date:InputDescriptor<DateTime> = {
  id: 'date',
  input: 'date',
  in: (val: string) => DateTime.fromISO(val),
  out: (val: DateTime) => val.toFormat('yyyy-MM-dd'),
  ist: DateAndTime.ist
};

export default Date;
