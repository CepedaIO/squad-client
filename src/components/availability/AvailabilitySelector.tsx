import Button from "../inline/Button";
import React, {Fragment, useState} from "react";
import {IAvailability, AvailabilityEdit, IAvailabilityForm, AvailabilityView} from "./Availability";
import {DurationLikeObject} from "luxon";

export interface AvailabilitySelectorProps {
  offset: DurationLikeObject;
  availability: IAvailability;
  onSubmit: (form: IAvailabilityForm) => void;
  onDelete: (form: IAvailabilityForm) => void;
  erroredIndexes?: number[];
}

const NULL_FORM: Partial<IAvailabilityForm> = {};

const AvailabilitySelector = ({
 offset, availability, onSubmit, onDelete, erroredIndexes
}: AvailabilitySelectorProps) => {
  const [editing, setEditing] = useState<Partial<IAvailabilityForm> | null>(null);
  const clickedAvailability = () => setEditing(NULL_FORM);
  const onSubmitForm = (form: IAvailabilityForm) => {
    onSubmit(form);
    onCancel();
  };
  const onCancel = () => setEditing(null);
  const onEdit = (availability: IAvailabilityForm) => setEditing(availability);
  const onDeleteForm = (form: IAvailabilityForm) => onDelete(form);

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
          offset={offset}
          form={editing}
          onSubmit={onSubmitForm}
          onCancel={onCancel}
        />
      }

      { availability.map((entry, index) =>
        <Fragment key={index}>
          { entry === editing &&
            <AvailabilityEdit
              offset={offset}
              form={entry}
              onSubmit={onSubmitForm}
              onCancel={onCancel}
            />
          }

          { entry !== editing &&
            <AvailabilityView
              errored={!!erroredIndexes && erroredIndexes.includes(index)}
              form={entry}
              onDelete={onDeleteForm}
              onEdit={onEdit}
            />
          }
        </Fragment>
      )}
    </main>
  )
}

export default AvailabilitySelector;
