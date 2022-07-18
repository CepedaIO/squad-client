import FormInput from "../components/inline-block/FormInput";
import Button from "../components/inline/Button";
import Calendar from "../components/calendar";
import React from "react";
import AvailabilitySelector from "../components/availability/AvailabilitySelector";

const Home = () => {
  return (
  <main className="flex flex-col h-full">
    <div className="mx-auto flex flex-col gap-6 w-full max-w-screen-sm">
      <h2>Event Info:</h2>
      <FormInput label={"Name:"} field={"name"} type={"text"} />
      <FormInput label={"Description:"} field={"description"} type={"textarea"} />

      <h2>Member Info:</h2>
      <FormInput label={"Display Name:"} field={"displayName"} type={"text"} />

      <AvailabilitySelector />

      <Calendar month={1} />

      <Button variant={"submit"}>Submit</Button>
    </div>
  </main>
  )
}

export default Home;
