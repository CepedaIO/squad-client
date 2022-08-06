import $c from "classnames";
import {DateTime, Interval} from "luxon";
import CalendarDay from "./CalendarDay";
import CalendarBox from "./CalendarBox";
import {IAvailability} from "../availability/Availability";

export interface CalendarProps {
  availability: IAvailability;
  month: DateTime['month']
}

const Calendar = ({ month }: CalendarProps) => {
  const interval = Interval.after(DateTime.fromObject({ month }), { month: 1 });
  const metadata = {
    start: interval.start,
    length: interval.length('days')
  };

  const clickedDate = (date:DateTime) => {
    console.log('clicked date:', date.toLocaleString());
  }

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
          clickedDate={clickedDate}
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
    <main>
      <header className={$c("text-center")}>
        { metadata.start.monthLong }
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
