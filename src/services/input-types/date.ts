import {DateTime} from "luxon";
import datetime from "./datetime";
import {TypeDescriptor} from "./index";

const Date = {
  _type: {
    id: 'date',
    type: 'date',
    in: (val: string) => DateTime.fromISO(val),
    out: (val: DateTime) => val.toFormat('yyyy-MM-dd')
  } as TypeDescriptor<DateTime>,
  defined: datetime.defined,
  afterToday: datetime.afterToday,
  greaterThan: datetime.greaterThan
};

export default Date;
