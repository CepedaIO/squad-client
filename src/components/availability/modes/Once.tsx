import Button from "../../inline/Button";
import React, {useEffect, useState} from "react";
import $c from "classnames";
import {DateTime} from "luxon";
import {useForm} from "../../../hooks/useForm";
import Date from "../../../services/validators/date";
import Time from "../../../services/validators/time";
import datetime from "../../../services/validators/datetime";
import Datetime from "../../../services/validators/datetime";

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
  const [values, valid, {FormInput, validate}] = useForm<OnceForm>();

  const onClickAdd = () => {
    if(validate()) {

    }
  };

  const onClickCancel = () => {

  };

  return (
    <main className={$c('flex flex-col gap-5')}>
      <FormInput
        label={"When?"}
        field={"date"}
        type={Date}
        nowrap={true}
        validator={(val, { values }) => {
          if(!DateTime.isDateTime(val)) {
            return 'Must pick a date';
          }

          if(!datetime.afterToday(val)) {
            return 'Date must come after today'
          }
        }}
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

