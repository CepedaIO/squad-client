import {DateTime} from "luxon";
import {TypeDescriptor} from "./index";
import Input, {InputProps} from "../../components/inline/Input";
import Split from "../../components/Split";

interface DurationProps extends InputProps<DateTime> {}

export const Duration = {
  _descriptor: {
    id: 'datetime',
    input: (props: DurationProps) => {

      return (
        <Split
          nowrap={true}
          left={
            <select className={'w-full'}>
              <option>Test</option>
            </select>
          }
          right={
            <Input
              className={'w-full'}
              type={'text'}
            />
          }
        />
      )
    },
    in: (val: string) => {
      console.log('in', val);
      return DateTime.fromISO(val);
    },
    out: (val: DateTime) => {
      console.log('out', val);
      return val.toISO();
    },
  } as TypeDescriptor<DateTime>,

};
