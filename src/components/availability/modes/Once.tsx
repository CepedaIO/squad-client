import FormInput from "../../inline-block/FormInput";
import Button from "../../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import {DateTime} from "luxon";

interface OnceProps {
  label: string;
  field: string;
}

const Once = ({ label, field }:OnceProps) => {
  const [allDay, setAllDay] = useState(true);

  return (
    <main className={$c('flex flex-col gap-5')}>
      <FormInput label={label} field={field} type={"date"} nowrap={true} />

      <Button variant={"toggle"} active={allDay} onClick={() => setAllDay(!allDay)}>
        All day?
      </Button>

      {!allDay && <>
        <FormInput
          label={"Start"}
          field={"start"}
          type={"time"}
          nowrap={true}
          validate={
            (val: DateTime) => {

              return {
                valid: false,
                message: 'Must enter a valid'
              };
            }
          }
        />

        <FormInput
          label={"End"}
          field={"end"}
          type={"time"}
          nowrap={true}
          validate={
            (val: DateTime) => {

              return {
                valid: false,
                message: 'Must enter a valid'
              };
            }
          }
        />
      </>}
    </main>
  )
};

export default Once;

