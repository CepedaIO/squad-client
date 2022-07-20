import FormInput from "../components/inline-block/FormInput";
import Button from "../components/inline/Button";
import Calendar from "../components/calendar";
import React from "react";
import AvailabilitySelector from "../components/availability/AvailabilitySelector";
import string from "../services/validate/validators/string";

const GroupNew = () => {
  return (
  <main className="flex flex-col h-full">
    <div className="mx-auto flex flex-col gap-6 w-full max-w-screen-sm">
      <h2>Event Info:</h2>
      <FormInput
        label={"Name:"}
        field={"name"}
        type={"text"}
        validators={[
          string.greaterThan(3)
        ]}
      />

      <FormInput
        label={"Description:"}
        field={"description"}
        type={"textarea"}
        validators={[
          string.greaterThan(5)
        ]}
      />

      <h2>Member Info:</h2>
      <FormInput
        label={"Display Name:"}
        field={"displayName"}
        type={"text"}
        validators={[
          string.greaterThan(3)
        ]}
      />

      <AvailabilitySelector />

      <Calendar month={1} />

      <Button variant={"submit"}>Submit</Button>
    </div>
  </main>
  )
}

export default GroupNew;
