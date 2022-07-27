import {DateTime} from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";

const greaterThan = (time: DateTime, unit: DateTimeUnit) => (val: DateTime) => val.diff(time, unit).get(unit) > 1;

const greaterThanEQ = (unit: DateTimeUnit) => (time: DateTime,  message?: string) => (val: DateTime) => [
  {
    valid: time.startOf(unit) <= val.startOf(unit),
    message: message || `Must be after ${time.toLocaleString()}`
  }
]

const lessThan = (unit: DateTimeUnit) => (time: DateTime,  message?: string) => ({
  id: 'Less Than',
  valid: (val: DateTime) => {
    console.log('wtf?');
    console.log(time);
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

const afterToday = greaterThan(DateTime.now(), 'day');

export const DateAndTime = {
  _id: 'datetime',
  _type: 'datetime',
  _transform: (val: string) => DateTime.fromISO(val),
  afterToday,
  greaterThan,
  greaterThanEQ,
  lessThan,
  lessThanEQ
};

export default DateAndTime;
