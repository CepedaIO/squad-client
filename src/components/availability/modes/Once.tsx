import Button from "../../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import {DateTime} from "luxon";
import {useForm} from "../../../hooks/useForm";
import Date from "../../../services/validators/date";
import Time from "../../../services/validators/time";

interface IOnceForm {
  date: DateTime;
  allDay: boolean;
  start: DateTime;
  end: DateTime;
}

const Once = () => {
  const [allDay, setAllDay] = useState(false);
  const {FormInput} = useForm<IOnceForm>();

  return (
    <main className={$c('flex flex-col gap-5')}>
      <FormInput
        label={"When?"}
        field={"date"}
        type={Date}
        nowrap={true}
        validator={(val, values) => {
          return 'This is a test';
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
    </main>
  )
};

export default Once;

