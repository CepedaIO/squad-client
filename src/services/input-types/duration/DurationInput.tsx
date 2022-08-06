import Input from "../../../components/inline/Input";
import Split from "../../../components/Split";
import {CustomInputProps} from "../index";
import {DateTime} from "luxon";

const DurationInput = (props: CustomInputProps<DateTime>) => {
  const durations = ['days', 'hours', 'minutes'];

  return (
    <Split
      className={'gap-5'}
      nowrap={true}
      left={
        <select className={'w-full py-3'} placeholder={'Choose Precision'}>
          { durations.map((duration) =>
            <option
              value={duration}
              key={duration}
            >
              { duration }
            </option>
          )}
        </select>
      }
      right={
        <Input
          { ...props }
          type={'number'}
          value={1}
          className={'w-full'}
          min={1}
          step={1}
          onChange={(value: number) => {
            console.log(value);
          }}
        />
      }
    />
  )
};

export default DurationInput;
