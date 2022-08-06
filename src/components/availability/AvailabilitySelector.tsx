import Button from "../inline/Button";
import React, {useState} from "react";
import {DateTime} from "luxon";
import {Availability, AvailabilityEdit, AvailabilityForm, AvailaibilityView} from "./Availability";

const NULL_FORM: Partial<AvailabilityForm> = {};

const AvailabilitySelector = () => {
  const [editing, setEditing] = useState<Partial<AvailabilityForm> | null>(null);
  const [availability, setAvailability] = useState<Availability>([
    { date: DateTime.now().plus({ day: 1 }), allDay: false, end: DateTime.now(), start: DateTime.now().minus({hour: 3}) },
    { date: DateTime.now().plus({ day: 1 }), allDay: true, end: DateTime.now(), start: DateTime.now().minus({hour: 3}) }
  ]);
  const clickedAvailability = () => setEditing(NULL_FORM);
  const onSubmit = (form: AvailabilityForm) => setAvailability((prev) => prev.concat(form));
  const onCancel = () => setEditing(null);
  const onEdit = (availability: AvailabilityForm) => setEditing(availability);
  const onDelete = (availability: AvailabilityForm) => setAvailability((prev) => prev.filter((entry) => entry !== availability));

  return (
    <main>
      { editing !== NULL_FORM &&
        <Button variant={"optional"} onClick={clickedAvailability} className={'w-full mb-3'}>
          <i className="fa-solid fa-circle-plus mr-3" />
          Availability
        </Button>
      }

      { editing && editing === NULL_FORM &&
        <AvailabilityEdit
          form={editing}
          onSubmit={onSubmit}
          onCancel={onCancel}
        />
      }

      { availability.map((entry, index) => <>
        { entry === editing &&
          <AvailabilityEdit
            form={entry}
            key={index}
            onSubmit={onSubmit}
            onCancel={onCancel}
          />
        }

        { entry !== editing &&
          <AvailaibilityView
            form={entry}
            key={index}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        }
      </>)}
    </main>
  )
}

export default AvailabilitySelector;
