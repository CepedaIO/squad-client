import FormInput from "../components/inline-block/FormInput";
import Button from "../components/inline/Button";
import Calendar from "../components/calendar";
import React, {useContext} from "react";
import AvailabilitySelector from "../components/availability/AvailabilitySelector";
import AppContext from "../providers/AppContext";
import FormContext, {createFormContext} from "../providers/FormContext";
import {DateTime} from "luxon";
import line from "../services/validators/line";
import multiline from "../services/validators/multiline";

export interface IGroupNewPageForm {
  start: DateTime;
  end: DateTime;
}

const GroupNewContent = () => {
  const {
    page: { validate }
  } = useContext(AppContext);

  const onClickSubmit = () => {
    validate();
  };

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

      <AvailabilitySelector />

      <Calendar month={1} />

      <Button variant={"submit"} onClick={onClickSubmit}>Submit</Button>
    </div>
  </main>
  )
}

const GroupNew = () => {
  const context = createFormContext({
    start: DateTime.now(),
    end: DateTime.now()
  });

  return (
    <FormContext.Provider value={ context }>
      <GroupNewContent />
    </FormContext.Provider>
  )
}

export default GroupNew;
