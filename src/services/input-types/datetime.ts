import {DateTime, DurationUnit} from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";
import {TypeDescriptor} from "./index";

const greaterThan = (time: DateTime, factor: number, unit: DurationUnit) => (val: DateTime) => {
  return val.diff(time, unit).get(unit) > factor;
};

const greaterThanUnit = (time: DateTime, unit: DateTimeUnit) => (val: DateTime) => val.startOf(unit) > time.startOf(unit);
const greaterThanEQ = (unit: DateTimeUnit) => (time: DateTime,  message?: string) => (val: DateTime) => [
  {
    valid: time.startOf(unit) <= val.startOf(unit),
    message: message || `Must be after ${time.toLocaleString()}`
  }
]

const lessThan = (unit: DateTimeUnit) => (time: DateTime,  message?: string) => ({
  id: 'Less Than',
  valid: (val: DateTime) => {
    return val.diff(time, unit).get(unit) < 1
  },
  message: message || `Must be after ${time.toLocaleString()}`
});

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
      console.log('in', val);
      return DateTime.fromISO(val);
    },
    out: (val: DateTime) => {
      console.log('out', val);
      return val.toISO();
    },
  } as TypeDescriptor<DateTime>,
  defined,
  afterToday,
  greaterThan,
  greaterThanEQ,
  lessThan,
  lessThanEQ
};

export default DateAndTime;
