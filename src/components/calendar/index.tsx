import $c from "classnames";
import {DateTime, Interval} from "luxon";
import CalendarDay from "./CalendarDay";
import CalendarBox from "./CalendarBox";
import {AvailabilityValidation, IAvailabilityBase} from "event-matcher-shared";

export interface CalendarProps {
  variant?: 'resolved';
  className?: string;
  availabilities: IAvailabilityBase[];
  secondary?: IAvailabilityBase[]
  month: number;
  shouldChange?: (month: number) => void;
}

const Calendar = ({ availabilities, month, shouldChange, className, secondary, variant }: CalendarProps) => {
  const interval = Interval.after(DateTime.fromObject({ month }), { month: 1 });
  const metadata = {
    start: interval.start,
    length: interval.length('days')
  };
  const editable = !!shouldChange;
  const clickedPrevious = () => shouldChange && shouldChange(DateTime.fromObject({ month }).minus({ months: 1 }).month);
  const clickedNext = () => shouldChange && shouldChange(DateTime.fromObject({ month }).plus({ months: 1 }).month);
  const chevronClasses = editable ? 'fa-solid cursor-pointer' : 'fa-solid';

  let daysLeft = metadata.length;
  const dates = [];
  let i = 0;
  let nextDay = metadata.start;
  while(daysLeft > 0  || (i % 7) !== 0) {
    const weekday = (i % 7) + 1;
    const isAvailable = AvailabilityValidation.availableOnDate(availabilities, nextDay);
    const secondaryAvailable = AvailabilityValidation.availableOnDate(secondary || [], nextDay);
    
    if(daysLeft > 0 && weekday === nextDay.weekday) {
      dates.push(
        <CalendarDay
          key={i}
          date={nextDay}
          className={$c({
            'bg-violet-100': isAvailable && !secondaryAvailable && !variant,
            'bg-yellow-100': isAvailable && secondaryAvailable && !variant,
            'bg-green-100': !isAvailable && secondaryAvailable,
            'bg-submit text-white': isAvailable && variant === 'resolved'
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
      
      
      <footer className={'center justify-between'}>
        <div className={'center'}>
          <div className={'bg-violet-100 h-[15px] w-[15px] mr-3'} />
          You
        </div>
  
        <div className={'center'}>
          <div className={'bg-green-100 h-[15px] w-[15px] mr-3'} />
          Others
        </div>
  
        <div className={'center'}>
          <div className={'bg-yellow-100 h-[15px] w-[15px] mr-3'} />
          Shared
        </div>
      </footer>
    </main>
  )
}

export default Calendar;
