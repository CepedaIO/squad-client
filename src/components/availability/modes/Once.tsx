import FormInput from "../../inline-block/FormInput";
import Button from "../../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import datetime from "../../../services/validate/validators/datetime";


const Once = () => {
  const [allDay, setAllDay] = useState(false);

  return (
    <main className={$c('flex flex-col gap-5')}>
      <FormInput
        label={"When?"}
        field={"date"}
        type={"date"}
        nowrap={true}
        validators={[
          datetime.afterNow
        ]}
      />

      <Button variant={"toggle"} active={allDay} onClick={() => setAllDay(!allDay)}>
        All day?
      </Button>

      {!allDay && <>
        <FormInput
          label={"Start"}
          field={"start"}
          type={"time"}
          nowrap={true}
          validators={[
            datetime.afterNow
          ]}
        />

        <FormInput
          label={"End"}
          field={"end"}
          type={"time"}
          nowrap={true}
        />
      </>}
    </main>
  )
};

export default Once;

