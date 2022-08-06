import {DateTime} from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";
import {TypeDescriptor} from "./index";

const greaterThan = (time: DateTime, unit: DateTimeUnit) => (val: DateTime) => val.diff(time, unit).get(unit) > 1;
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
  _type: {
    id: 'datetime',
    type: 'datetime-local',
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
