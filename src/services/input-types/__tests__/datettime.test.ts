import {DateTime, Duration} from "luxon";
import datetime, {DateAndTime} from "../datetime";

describe.only('datetime', () => {
  it('should be greater than date', () => {
    const start = DateTime.fromISO('2022-08-06T12:00:00')
    const end = DateTime.fromISO('2022-09-08T13:30:30');

    expect(DateAndTime.greaterThan(start, Duration.fromDurationLike({ months: 1 }))(end))
  });

  it('should not be greater than date', () => {
    const start = DateTime.fromISO('2022-09-06T12:00:00')
    const end = DateTime.fromISO('2022-08-08T13:30:30');

    expect(DateAndTime.greaterThan(start, Duration.fromDurationLike({months: 1}))(end)).to.be.true;
  });
});
