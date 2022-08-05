import Button from "../../inline/Button";
import React from "react";
import $c from "classnames";
import {DateTime} from "luxon";
import Date from "../../../services/input-types/date";
import Time from "../../../services/input-types/time";
import useForm from "../../../hooks/useForm/index";

interface OnceProps {
  submit(form: OnceForm): void;
}

export interface OnceForm {
  date: DateTime;
  allDay: boolean;
  start: DateTime;
  end: DateTime;
}

const Once = ({
  submit
}: OnceProps) => {
  const {validate, values, FormInput, FormToggle} = useForm<OnceForm>();

  const onClickAdd = () => {
    const [valid, values] = validate();
    if(valid) { submit(values); }
  };

  const onClickCancel = () => {

  };

  return (
    <main className={$c('flex flex-col gap-3')}>
      <FormInput
        label={"When?"}
        field={"date"}
        type={Date}
        nowrap={true}
        validator={() => [
          [Date.defined, 'Must pick a date'],
          [Date.afterToday, 'Date must come after today']
        ]}
      />

      <FormToggle field={"allDay"} className={'mb-5'}>
        All day?
      </FormToggle>

      {!values.allDay && <>
        <FormInput
          label={"Start"}
          field={"start"}
          type={Time}
          nowrap={true}
          omit={({allDay}) => !!allDay}
          validator={({ end }, { required,  }) => [
            [Date.defined, 'Must pick a time'],
            required('end', [
              [Time.lessThan(end, -1, 'hour'), 'Must be at least 1 hour before end']
            ])
          ]}
        />

        <FormInput
          label={"End"}
          field={"end"}
          type={Time}
          nowrap={true}
          omit={({allDay}) => !!allDay}
          validator={({ start }, { required }) => [
            [Date.defined, 'Must pick a time'],
            required('start', [
              [Time.greaterThan(start, 1, 'hour'), 'Must be at least 1 hour after start']
            ])
          ]}
        />
      </>}

      <footer className={$c('center grow-children')}>
        <Button variant={"link"} onClick={onClickCancel}>
          Cancel
        </Button>
        <Button variant={"link"} onClick={onClickAdd}>
          Add
        </Button>
      </footer>
    </main>
  )
};

export default Once;

