import {DateTime} from "luxon";

const Time:TypeDescriptor<DateTime> = {
  id: 'time',
  type: 'time',
  in: (val: string) => DateTime.fromFormat(val, 'HH:mm:ss'),
  out: (val: DateTime) => val.toFormat('HH:mm:ss')
};

export default Time;
