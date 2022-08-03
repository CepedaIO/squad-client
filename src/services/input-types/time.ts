import {DateTime, DateTimeUnit} from "luxon";

const greaterThan = (time: DateTime, factor: number, unit: DateTimeUnit) => (val: DateTime) => val.diff(time, unit).get(unit) > factor;
const lessThan = (time: DateTime, factor: number, unit: DateTimeUnit) => (val: DateTime) => val.diff(time, unit).get(unit) < factor;

const Time = {
  _type: {
    id: 'time',
    type: 'time',
    in: (val: string) => DateTime.fromFormat(val, 'HH:mm'),
    out: (val: DateTime) => val.toFormat('HH:mm'),
  } as TypeDescriptor<DateTime>,
  defined: DateTime.isDateTime,
  greaterThan: greaterThan,
  lessThan: lessThan
}

export default Time;
