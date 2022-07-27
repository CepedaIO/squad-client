import {DateTime} from "luxon";
import datetime from "./datetime";

const Date = {
  _type: {
    id: 'date',
    type: 'date',
    in: (val: string) => DateTime.fromISO(val),
    out: (val: DateTime) => val.toFormat('yyyy-MM-dd')
  } as TypeDescriptor<DateTime>,
  defined: datetime.defined,
  afterToday: datetime.afterToday
};

export default Date;
