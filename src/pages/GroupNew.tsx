import Button from "../components/inline/Button";
import Calendar from "../components/calendar";
import React, {useState} from "react";
import AvailabilitySelector from "../components/availability/AvailabilitySelector";
import FormContext, {createFormContext} from "../providers/FormContext";
import {DateTime} from "luxon";
import line from "../services/input-types/line";
import multiline from "../services/input-types/multiline";
import useForm from "../hooks/useForm/index";
import {IAvailability, AvailabilityForm} from "../components/availability/Availability";

export interface IGroupNewPageForm {
  name: string;
  description: string;
  displayName: string;
  start: DateTime;
  end: DateTime;
}

const GroupNewContent = () => {
  const { validate, FormInput } = useForm<IGroupNewPageForm>();
  const [availability, setAvailability] = useState<IAvailability>([
    { date: DateTime.now().plus({ day: 1 }), allDay: false, end: DateTime.now(), start: DateTime.now().minus({hour: 3}) },
    { date: DateTime.now().plus({ day: 1 }), allDay: true, end: DateTime.now(), start: DateTime.now().minus({hour: 3}) }
  ]);
  const onClickSubmit = () => {
    validate();
  };

  const onSubmitAvailability = (form: AvailabilityForm) => setAvailability((prev) => ({
    ...prev,
    form
  }));

  const onDeleteAvailability = (form: AvailabilityForm) => setAvailability((prev) => prev.filter((entry) => entry !== form));

  return (
  <main className="flex flex-col h-full">
    <div className="mx-auto flex flex-col gap-6 w-full max-w-screen-sm">
      <h2>Event Info:</h2>
      <FormInput
        label={"Name:"}
        field={"name"}
        type={line}
      />

      <FormInput
        label={"Description:"}
        field={"description"}
        type={multiline}
      />

      <h2>Member Info:</h2>
      <FormInput
        label={"Display Name:"}
        field={"displayName"}
        type={line}
      />

      <AvailabilitySelector
        availability={availability}
        onSubmit={onSubmitAvailability}
        onDelete={onDeleteAvailability}
      />

      <Calendar
        month={1}
        availability={availability}
      />

      <Button variant={"submit"} onClick={onClickSubmit}>Submit</Button>
    </div>
  </main>
  )
}

const GroupNew = () => {
  const context = createFormContext({});

  return (
    <FormContext.Provider value={ context }>
      <GroupNewContent />
    </FormContext.Provider>
  )
}

export default GroupNew;
