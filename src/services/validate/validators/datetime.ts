import {DateTime} from "luxon";
import {DateTimeUnit} from "luxon/src/datetime";

const greaterThan = (time: DateTime, unit: DateTimeUnit, message?: string) => (val: DateTime) => [
  {
    valid: time.startOf(unit) <= val.startOf(unit),
    message: message || `Must be after ${time.toLocaleString()}`
  }
]

const afterNow = greaterThan(DateTime.now(), 'day', 'Muster be after today');

const DateTimeValidators = {
  afterNow,
  greaterThan
}

export default DateTimeValidators;
