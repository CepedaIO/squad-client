import React from "react";
import $c from "classnames";
import {DateTime, Duration, DurationLikeObject} from "luxon";
import {DateAndTime} from "../../../services/input-types/datetime";
import {useFormControls} from "../../../hooks/useFormControls";
import FormContext, {createFormContext} from "../../../providers/FormContext";
import {IAvailabilityMode} from "../Availability";
import {ist} from "../../../services/utils";

export const Range: IAvailabilityMode<RangeForm> = {
  label: 'Range',
  applies: ist<RangeForm>((obj) => DateTime.isDateTime(obj.start) && DateTime.isDateTime(obj.end)),
  Edit: (props) => <RangeEdit {...props} />,
  View: (props) => <RangeView {...props} />,
  durationValid: (range: RangeForm, durLike: DurationLikeObject) =>
    DateAndTime.greaterThan(range.start, Duration.fromDurationLike(durLike))(range.end)
}

export interface RangeForm {
  start: DateTime;
  end: DateTime;
}

export interface RangeViewProps {
  form: RangeForm;
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
  form?: Partial<RangeForm>;
}

export const RangeEdit = ({offset}: RangeEditProps) => {
  const {FormInput} = useFormControls<RangeForm>();
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
