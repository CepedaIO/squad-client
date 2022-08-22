import React from "react";
import $c from "classnames";
import {Duration, DurationLikeObject} from "luxon";
import {DateAndTime} from "../../../services/input-types/datetime";
import {useFormControls} from "../../../hooks/useFormControls";
import {IAvailabilityMode} from "../Availability";
import {RangeUtils, IRangeForm} from "event-matcher-shared";

export const Range: IAvailabilityMode = {
  label: 'Range',
  applies: RangeUtils.applies,
  Edit: (props) => <RangeEdit {...props} />,
  View: (props) => <RangeView {...props} />
};

export interface RangeViewProps {
  form: IRangeForm;
}

export const RangeView = ({form}: RangeViewProps) => (
  <main
    className={$c('py-3 md:px-3 flex flex-row justify-between items-center cursor-pointer') }
  >
    <div className={'flex flex-col items-center'}>
      <span>{ form.start.toFormat('LLLL dd') }</span>
      <span>{ form.start.toFormat('T') }</span>
    </div>

    <span>{'->'}</span>

    <div className={'flex flex-col items-center'}>
      <span>{ form.end.toFormat('LLLL dd') }</span>
      <span>{ form.end.toFormat('T') }</span>
    </div>
  </main>
);

interface RangeEditProps {
  offset: DurationLikeObject;
  form?: Partial<IRangeForm>;
}

export const RangeEdit = ({offset}: RangeEditProps) => {
  const {FormInput} = useFormControls<IRangeForm>();
  const duration = Duration.fromDurationLike(offset);

  return (
    <main className={$c('flex flex-col gap-3')}>
      <FormInput
        label={"Start"}
        field={"start"}
        type={DateAndTime}
        nowrap={true}
        validator={[
          ({ end }, { required }) => [
            [DateAndTime.defined, 'Must pick a time'],
            required('end', [
              [DateAndTime.lessThan(end, duration.negate()), `Must be at least ${duration.toHuman()} before end`]
            ])
          ], [offset]
        ]}
      />

      <FormInput
        label={"End"}
        field={"end"}
        type={DateAndTime}
        nowrap={true}
        validator={[
          ({ start }, { required }) => [
            [DateAndTime.defined, 'Must pick a time'],
            required('start', [
              [DateAndTime.greaterThan(start, duration), `Must be at least ${duration.toHuman()} after start`]
            ])
          ], [offset]
        ]}
      />
    </main>
  );
};
