import Input from "../../../components/inline/Input";
import Split from "../../../components/Split";
import {CustomInputProps} from "../index";
import {DurationLikeObject} from "luxon";

const durations = ['days', 'hours', 'minutes'] as const

const DurationInput = (props: CustomInputProps<DurationLikeObject>) => {
  const precision = Object.keys(props.value ?? {})[0] ?? 'days';
  const factor = Object.values(props.value ?? {})[0] ?? '';

  return (
    <Split
      className={'gap-5'}
      nowrap={true}
      left={
        <select
          className={'w-full py-3'}
          placeholder={'Choose Precision'}
          value={precision}
          onChange={(event) => props.onChange && props.onChange({
            [event.target.value]: factor
          })}
          data-cy={`select:${props["data-cy"]}`}
        >
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
          value={factor}
          className={'w-full'}
          min={1}
          step={1}
          onChange={(value: number) => props.onChange && props.onChange({
            [precision]: value
          })}
          data-cy={`input:${props["data-cy"]}`}
        />
      }
    />
  )
};

export default DurationInput;
