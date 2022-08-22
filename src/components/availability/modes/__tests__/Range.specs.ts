import {Range, RangeForm} from "../Range";
import {DateTime} from "luxon";

describe('range', () => {
  it.only('should have a valid date', () => {
    const range:RangeForm = {
      start: DateTime.fromISO('2022-08-18T22:02:00-04:00'),
      end: DateTime.fromISO('2022-08-20T23:03:00-04:00')
    };

    expect(Range.dateValid(range, DateTime.fromISO('2022-08-1T03:00:00-04:00'))).to.be.true;
  })
});
