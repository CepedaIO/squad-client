import {DateTime} from "luxon";
import {AdapterDescriptor} from "./index";
import {DateTimeValidation} from "squad-shared";

export const DateAndTime: AdapterDescriptor<DateTime> = {
  id: 'datetime',
  input: 'datetime-local',
  ist: DateTimeValidation.ist,
  in: (val: string) => DateTime.fromISO(val),
  out: (val: DateTime) => val.toFormat('yyyy-LL-dd\'T\'HH:mm'),
};

export default DateAndTime;
