import Button from "../inline/Button";
import React, {Fragment, useState} from "react";
import {AvailabilityEdit, AvailabilityView} from "./Availability";
import {DurationLikeObject} from "luxon";
import {remove, upsert} from "../../services/utils";
import { IAvailability } from "event-matcher-shared";

export interface AvailabilitySelectorProps {
  offset: DurationLikeObject;
  availabilities: IAvailability[];
  onChange: (form: IAvailability[]) => void;
  erroredIndexes?: number[];
}

const NULL_FORM: Partial<IAvailability> = {};

const AvailabilitySelector = ({
 offset, availabilities, onChange, erroredIndexes
}: AvailabilitySelectorProps) => {
  const [editing, setEditing] = useState<Partial<IAvailability> | null>(null);
  const clickedAvailability = () => setEditing(NULL_FORM);
  const onSubmitForm = (form: IAvailability) => {
    onChange(upsert(availabilities, editing, form));
    onCancel();
  };
  const onCancel = () => setEditing(null);
  const onEdit = (availability: IAvailability) => setEditing(availability);
  const onDeleteForm = (form: IAvailability) => onChange(remove(availabilities, form));

  return (
    <main>
      { editing !== NULL_FORM &&
        <Button
          variant={"optional"}
          onClick={clickedAvailability}
          className={'w-full mb-3'}
          data-cy={'availability'}
        >
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

      { availabilities.map((entry, index) =>
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
