import {DateTime} from "luxon";

const Time = {
  _type: {
    id: 'time',
    type: 'time',
    in: (val: string) => DateTime.fromFormat(val, 'HH:mm:ss'),
    out: (val: DateTime) => val.toFormat('HH:mm:ss')
  } as TypeDescriptor<DateTime>
}

export default Time;
