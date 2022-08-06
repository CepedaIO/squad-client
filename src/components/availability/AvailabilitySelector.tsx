import Button from "../inline/Button";
import React, {useState} from "react";
import {IAvailability, AvailabilityEdit, AvailabilityForm, AvailabilityView} from "./Availability";

export interface AvailabilitySelectorProps {
  availability: IAvailability;
  onSubmit: (form: AvailabilityForm) => void;
  onDelete: (form: AvailabilityForm) => void;
}

const NULL_FORM: Partial<AvailabilityForm> = {};

const AvailabilitySelector = ({
  availability, onSubmit, onDelete
}: AvailabilitySelectorProps) => {
  const [editing, setEditing] = useState<Partial<AvailabilityForm> | null>(null);
  const clickedAvailability = () => setEditing(NULL_FORM);
  const onSubmitForm = (form: AvailabilityForm) => onSubmit(form);
  const onCancel = () => setEditing(null);
  const onEdit = (availability: AvailabilityForm) => setEditing(availability);
  const onDeleteForm = (form: AvailabilityForm) => onDelete(form);

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
          onSubmit={onSubmitForm}
          onCancel={onCancel}
        />
      }

      { availability.map((entry, index) => <>
        { entry === editing &&
          <AvailabilityEdit
            form={entry}
            key={index}
            onSubmit={onSubmitForm}
            onCancel={onCancel}
          />
        }

        { entry !== editing &&
          <AvailabilityView
            form={entry}
            key={index}
            onDelete={onDeleteForm}
            onEdit={onEdit}
          />
        }
      </>)}
    </main>
  )
}

export default AvailabilitySelector;
