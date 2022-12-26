import {DateTime} from "luxon";
import {DateTimeValidation} from "squad-shared";
import {InputDescriptor} from "./index";
import Input, {InputProps} from "../../components/inline/Input";
import $c from "classnames";

const Date:InputDescriptor<DateTime> = {
  id: 'date',
  input: (props: InputProps<'date'>) => (
    <Input
      {...props}
      type={'date'}
      className={$c(props.className, 'p-2')}
    />
  ),
  ist: DateTimeValidation.ist
};

export default Date;
