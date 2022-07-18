import {FC, DetailedHTMLProps, HTMLAttributes} from "react";
import $c from "classnames";

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>
interface CalendarBoxProps {
  children?: any;
}

const Calendarbox: FC<CalendarBoxProps & DivProps> = (props) => {
  const className = props.className;

  return (
    <main {...props} className={$c('p-2', className)}>
      { props.children }
    </main>
  );
}

export default Calendarbox;
