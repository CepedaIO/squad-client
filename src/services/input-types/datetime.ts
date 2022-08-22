import {DateTime} from "luxon";
import {AdapterDescriptor} from "./index";
import {DateTimeValidation} from "event-matcher-shared";

export const DateAndTime = {
  _descriptor: {
    id: 'datetime',
    input: 'datetime-local',
    in: (val: string) => DateTime.fromISO(val),
    out: (val: DateTime) => val.toFormat('yyyy-LL-dd\'T\'HH:mm'),
  } as AdapterDescriptor<DateTime>,
  ...DateTimeValidation
};

export default DateAndTime;
