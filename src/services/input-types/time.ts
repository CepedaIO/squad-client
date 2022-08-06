import {DateTime, DateTimeUnit} from "luxon";
import {TypeDescriptor} from "./index";

const greaterThan = (time: DateTime, factor: number, unit: DateTimeUnit) => (val: DateTime) => val.diff(time, unit).get(unit) > factor;
const lessThan = (time: DateTime, factor: number, unit: DateTimeUnit) => (val: DateTime) => val.diff(time, unit).get(unit) < factor;

const Time = {
  _descriptor: {
    id: 'time',
    input: 'time',
    in: (val: string) => DateTime.fromFormat(val, 'HH:mm'),
    out: (val: DateTime) => val.toFormat('HH:mm'),
  } as TypeDescriptor<DateTime>,
  defined: DateTime.isDateTime,
  greaterThan: greaterThan,
  lessThan: lessThan
}

export default Time;
