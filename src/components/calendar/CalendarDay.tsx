import {DateTime} from "luxon";
import $c from "classnames";
import CalendarBox from "./CalendarBox";

interface CalendarDayProps {
  date: DateTime
  clickedDate: (date:DateTime) => void;
}

const CalendarDay = ({
 date, clickedDate
}: CalendarDayProps) => {
  return (
    <CalendarBox className={$c('cursor-pointer')} onClick={() => clickedDate(date)}>
      { date.day }
    </CalendarBox>
  )
}

export default CalendarDay;
