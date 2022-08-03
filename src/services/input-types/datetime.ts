import {DateTime} from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";

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
afterToday.message = 'Date must come after today';

const defined:Assertion<DateTime> = (val: DateTime | undefined) => DateTime.isDateTime(val);
defined.message = 'Must pick a date';

export const DateAndTime = {
  _id: 'datetime',
  _type: 'datetime',
  _transform: (val: string) => DateTime.fromISO(val),
  defined,
  afterToday,
  greaterThan,
  greaterThanEQ,
  lessThan,
  lessThanEQ
};

export default DateAndTime;
