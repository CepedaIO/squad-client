import $c from "classnames";
import {DateTime, Interval} from "luxon";
import CalendarDay from "./CalendarDay";
import CalendarBox from "./CalendarBox";
import {AvailabilityValidation, IAvailabilityBase} from "event-matcher-shared";

export interface CalendarProps {
  className?: string;
  availabilities: IAvailabilityBase[];
  month: number;
  shouldChange?: (month: number) => void;
}

const Calendar = ({ availabilities, month, shouldChange, className }: CalendarProps) => {
  const interval = Interval.after(DateTime.fromObject({ month }), { month: 1 });
  const metadata = {
    start: interval.start,
    length: interval.length('days')
  };
  const clickedPrevious = () => shouldChange && shouldChange(DateTime.fromObject({ month }).minus({ months: 1 }).month);
  const clickedNext = () => shouldChange && shouldChange(DateTime.fromObject({ month }).plus({ months: 1 }).month);
  const chevronClasses = 'fa-solid cursor-pointer';

  let daysLeft = metadata.length;
  const dates = [];
  let i = 0;
  let nextDay = metadata.start;
  while(daysLeft > 0  || (i % 7) !== 0) {
    const weekday = (i % 7) + 1;

    if(daysLeft > 0 && weekday === nextDay.weekday) {
      dates.push(
        <CalendarDay
          key={i}
          date={nextDay}
          className={$c({
            'bg-violet-100': AvailabilityValidation.availableOnDate(availabilities, nextDay)
          })}
        />
      );

      nextDay = nextDay.plus({ day:1 });
      daysLeft--;
    } else {
      dates.push(
        <CalendarBox
          className={$c('bg-gray-100')}
          key={i}
        />);
    }

    i++;
  }

  const weekdays = ['S','M','T','W','T','F','S'].map((weekday, i) =>
    <CalendarBox key={`weekday-${i+1}`}>{ weekday }</CalendarBox>
  )

  return (
    <main className={className}>
      <header className={$c("text-center flex flex-row justify-between items-center")}>
        <i className={$c('fa-chevron-left ml-5', chevronClasses)} onClick={clickedPrevious}></i>
        <span>{ metadata.start.monthLong }</span>
        <i className={$c('fa-chevron-right mr-5', chevronClasses)} onClick={clickedNext}></i>
      </header>
      <section className={$c("grid grid-cols-7 justify-center text-center")}>
        {
          weekdays
        }

        {
          dates
        }
      </section>
    </main>
  )
}

export default Calendar;
