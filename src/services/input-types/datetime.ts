import {DateTime, Duration} from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";
import {InputDescriptor} from "./index";

const greaterThan = (time: DateTime, offset: Duration) =>
  (val: DateTime) => val > time.plus(offset);

const lessThan = (time: DateTime, offset: Duration) =>
  (val: DateTime) => val < time.plus(offset);

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
    in: (val: string) => DateTime.fromISO(val),
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
