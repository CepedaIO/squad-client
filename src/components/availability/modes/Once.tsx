import Button from "../../inline/Button";
import React, {useEffect, useState} from "react";
import $c from "classnames";
import {DateTime} from "luxon";
import {useForm} from "../../../hooks/useForm";
import Date from "../../../services/input-types/date";
import Time from "../../../services/input-types/time";
import datetime from "../../../services/input-types/datetime";
import Datetime from "../../../services/input-types/datetime";
import {validateWith} from "../../../services/input-types";

interface OnceProps {
  submit(form: OnceForm): void;
}

export interface OnceForm {
  date: DateTime;
  allDay: boolean;
  start: DateTime;
  end: DateTime;
  test: Date;
}

const Once = ({
  submit
}: OnceProps) => {
  const [allDay, setAllDay] = useState(false);
  const [values, validate, {FormInput}] = useForm<OnceForm>();

  const onClickAdd = () => {
    const [valid, values] = validate();
    if(valid) { submit(values); }
    else {
      console.log('invalid', values);
    }
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
        validator={
          validateWith([
            [Date.defined, 'Must pick a date'],
            [Date.afterToday, 'Date must come after today']
          ])
        }
      />

      <Button variant={"toggle"} active={allDay} onClick={() => setAllDay(!allDay)}>
        All day?
      </Button>

      {!allDay && <>
        <FormInput
          label={"Start"}
          field={"start"}
          type={Time}
          nowrap={true}
        />

        <FormInput
          label={"End"}
          field={"end"}
          type={Time}
          nowrap={true}
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

