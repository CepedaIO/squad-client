import Button from "../components/inline/Button";
import Calendar from "../components/calendar";
import React from "react";
import AvailabilitySelector from "../components/availability/AvailabilitySelector";
import FormContext, {createFormContext} from "../providers/FormContext";
import line from "../services/input-types/line";
import multiline from "../services/input-types/multiline";
import useForm from "../hooks/useForm";
import {IAvailability, AvailabilityForm} from "../components/availability/Availability";
import {useFormControls} from "../hooks/useFormControls";
import {DurationLikeObject} from 'luxon';
import {Duration} from "../services/input-types/duration/duration";

export interface IGroupNewPageForm {
  name: string;
  description: string;
  duration: DurationLikeObject;
  displayName: string;
  availability: IAvailability;
}

const GroupNewContent = () => {
  const { validate, setValue, values:{ availability, duration } } = useForm<IGroupNewPageForm>();
  const { FormInput } = useFormControls<IGroupNewPageForm>();

  const onClickSubmit = () => {
    validate();
  };

  const onSubmitAvailability = (form: AvailabilityForm) => {
    setValue('availability', (prev) => ([
      ...(prev ?? []),
      form
    ]))
  }

  const onDeleteAvailability = (form: AvailabilityForm) => setValue('availability', (prev) => prev.filter((entry) => entry !== form));

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

      <FormInput
        label={"Duration:"}
        field={"duration"}
        type={Duration}
      />

      <h2>Member Info:</h2>
      <FormInput
        label={"Display Name:"}
        field={"displayName"}
        type={line}
      />

      <AvailabilitySelector
        offset={duration}
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
  const context = createFormContext<IGroupNewPageForm>({
    name: '',
    description: '',
    duration: { hours: 1 },
    displayName: '',
    availability: []
  });

  return (
    <FormContext.Provider value={ context }>
      <GroupNewContent />
    </FormContext.Provider>
  )
}

export default GroupNew;
