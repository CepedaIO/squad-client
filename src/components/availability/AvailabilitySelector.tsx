import Button from "../inline/Button";
import React, {Fragment, useState} from "react";
import {IAvailability, AvailabilityEdit, AvailabilityForm, AvailabilityView} from "./Availability";
import FormContext, {createFormContext} from "../../providers/FormContext";
import {Duration} from "luxon";

export interface AvailabilitySelectorProps {
  limit: Duration;
  availability: IAvailability;
  onSubmit: (form: AvailabilityForm) => void;
  onDelete: (form: AvailabilityForm) => void;
}

const NULL_FORM: Partial<AvailabilityForm> = {};

const AvailabilitySelector = ({
 limit, availability, onSubmit, onDelete
}: AvailabilitySelectorProps) => {
  const [editing, setEditing] = useState<Partial<AvailabilityForm> | null>(null);
  const clickedAvailability = () => setEditing(NULL_FORM);
  const onSubmitForm = (form: AvailabilityForm) => {
    onSubmit(form);
    onCancel();
  };
  const onCancel = () => setEditing(null);
  const onEdit = (availability: AvailabilityForm) => setEditing(availability);
  const onDeleteForm = (form: AvailabilityForm) => onDelete(form);

  const context = createFormContext({});
  return (
  <FormContext.Provider value={ context }>
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

      { availability.map((entry, index) =>
        <Fragment key={index}>
          { entry === editing &&
            <AvailabilityEdit
              form={entry}
              onSubmit={onSubmitForm}
              onCancel={onCancel}
            />
          }

          { entry !== editing &&
            <AvailabilityView
              form={entry}
              onDelete={onDeleteForm}
              onEdit={onEdit}
            />
          }
        </Fragment>
      )}
    </main>
  </FormContext.Provider>
  )
}

export default AvailabilitySelector;
