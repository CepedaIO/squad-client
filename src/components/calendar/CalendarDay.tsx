import {DateTime} from "luxon";
import $c from "classnames";
import CalendarBox from "./CalendarBox";

interface CalendarDayProps {
  className?: string;
  date: DateTime;
  clickedDate?: (date:DateTime) => void;
  active?: boolean;
}

const CalendarDay = ({
 active, date, clickedDate, className
}: CalendarDayProps) => {
  return (
    <CalendarBox
      className={$c('cursor-default', {
        'bg-violet-100': active === true
      }, className)}
      onClick={() => clickedDate && clickedDate(date)}
    >
      { date.day }
    </CalendarBox>
  )
}

export default CalendarDay;
