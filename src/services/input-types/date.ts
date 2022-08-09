import {DateTime} from "luxon";
import datetime from "./datetime";
import {InputDescriptor} from "./index";

const Date = {
  _descriptor: {
    id: 'date',
    input: 'date',
    in: (val: string) => DateTime.fromISO(val),
    out: (val: DateTime) => val.toFormat('yyyy-MM-dd')
  } as InputDescriptor<DateTime>,
  defined: datetime.defined,
  afterToday: datetime.afterToday,
  greaterThan: datetime.greaterThan
};

export default Date;
