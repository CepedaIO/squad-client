import React from "react";
import $c from "classnames";
import {Duration, DurationLikeObject} from "luxon";
import {DateAndTime} from "../../../services/input-types/datetime";
import {useFormControls} from "../../../hooks/useFormControls";
import {IAvailabilityMode} from "../Availability";
import {RangeUtils, IRangeForm, RangeFormFactory} from "squad-shared";

export const Range: IAvailabilityMode = {
  label: 'Range',
  applies: RangeUtils.applies,
  Edit: (props) => <RangeEdit {...props} />,
  View: (props) => <RangeView {...props} />
};

export interface RangeViewProps {
  form: IRangeForm;
  'data-cy': string;
}

export const RangeView = (props: RangeViewProps) => (
  <main
    className={$c('py-3 md:px-3 flex flex-row justify-between items-center cursor-pointer') }
  >
    <div className={'flex flex-col items-center'} data-cy={`${props["data-cy"]}:start`}>
      <span>{ props.form.start.toFormat('LLLL dd') }</span>
      <span>{ props.form.start.toFormat('T') }</span>
    </div>

    <span>{'->'}</span>

    <div className={'flex flex-col items-center'} data-cy={`${props["data-cy"]}:end`}>
      <span>{ props.form.end.toFormat('LLLL dd') }</span>
      <span>{ props.form.end.toFormat('T') }</span>
    </div>
  </main>
);

interface RangeEditProps {
  offset: DurationLikeObject;
  form?: Partial<IRangeForm>;
  'data-cy': string;
}

export const RangeEdit = (props: RangeEditProps) => {
  const {FormInput} = useFormControls<IRangeForm>();
  const duration = Duration.fromDurationLike(props.offset);
  const rangeForm = RangeFormFactory({ duration })

  return (
    <main className={$c('flex flex-col gap-3')}>
      <FormInput
        label={"Start"}
        field={"start"}
        type={DateAndTime}
        nowrap={true}
        validator={[rangeForm.validation.start!, [props.offset]]}
        data-cy={`${props["data-cy"]}:start`}
      />

      <FormInput
        label={"End"}
        field={"end"}
        type={DateAndTime}
        nowrap={true}
        validator={[rangeForm.validation.end!, [props.offset]]}
        data-cy={`${props["data-cy"]}:end`}
      />
    </main>
  );
};
