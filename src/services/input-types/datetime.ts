import {DateTime, DurationUnit} from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";
import {InputDescriptor} from "./index";

const greaterThan = (time: DateTime, factor: number, unit: DurationUnit) => (val: DateTime) => {
  console.log(val.toLocaleString(DateTime.DATETIME_MED));
  console.log(time.toLocaleString(DateTime.DATETIME_MED));
  console.log(val.diff(time, unit).get(unit), factor);

  return val.diff(time, unit).get(unit) > factor;
};

const lessThan = (time: DateTime, factor: number, unit: DurationUnit) => (val: DateTime) => {
  return val.diff(time, unit).get(unit) < factor;
};

const greaterThanUnit = (time: DateTime, unit: DateTimeUnit) => (val: DateTime) => val.startOf(unit) > time.startOf(unit);
const greaterThanEQ = (unit: DateTimeUnit) => (time: DateTime,  message?: string) => (val: DateTime) => [
  {
    valid: time.startOf(unit) <= val.startOf(unit),
    message: message || `Must be after ${time.toLocaleString()}`
  }
];

const lessThanEQ = (unit: DateTimeUnit) => (time: DateTime,  message?: string) => (val: DateTime) => [
  {
    valid: time.startOf(unit) >= val.startOf(unit),
    message: message || `Must be after ${time.toLocaleString()}`
  }
]

const afterToday:Assertion<DateTime> = greaterThanUnit(DateTime.now(), 'day');
const defined:Assertion<DateTime> = (val: DateTime | undefined) => DateTime.isDateTime(val);

export const DateAndTime = {
  _descriptor: {
    id: 'datetime',
    input: 'datetime-local',
    in: (val: string) => {
      debugger;
      return DateTime.fromISO(val)
    },
    out: (val: DateTime) => val.toFormat('yyyy-LL-dd\'T\'HH:mm'),
  } as InputDescriptor<DateTime>,
  defined,
  afterToday,
  greaterThan,
  greaterThanEQ,
  lessThan,
  lessThanEQ
};

export default DateAndTime;
