import Button from "../inline/Button";
import React, {Fragment, useState} from "react";
import {AvailabilityEdit, AvailabilityView} from "./Availability";
import {DurationLikeObject} from "luxon";
import {remove, upsert} from "../../services/utils";
import { IAvailabilityBase } from "event-matcher-shared";

export interface AvailabilitySelectorProps {
  offset: DurationLikeObject;
  availabilities: IAvailabilityBase[];
  onChange: (form: IAvailabilityBase[]) => void;
  erroredIndexes?: number[];
  'data-cy': string;
}

const NULL_FORM: Partial<IAvailabilityBase> = {};

const AvailabilitySelector = (props: AvailabilitySelectorProps) => {
  const { offset, availabilities, onChange, erroredIndexes } = props;
  const [editing, setEditing] = useState<Partial<IAvailabilityBase> | null>(null);
  const clickedAvailability = () => setEditing(NULL_FORM);
  const onSubmitForm = (form: IAvailabilityBase) => {
    onChange(upsert(availabilities, editing, form));
    onCancel();
  };
  const onCancel = () => setEditing(null);
  const onEdit = (availability: IAvailabilityBase) => setEditing(availability);
  const onDeleteForm = (form: IAvailabilityBase) => onChange(remove(availabilities, form));
  const dataCy = `${props["data-cy"]}:availability`;
  return (
    <main>
      { editing !== NULL_FORM &&
        <Button
          variant={"optional"}
          onClick={clickedAvailability}
          className={'w-full mb-3'}
          data-cy={dataCy}
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
          data-cy={dataCy}
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
              data-cy={`${dataCy}:${index}`}
            />
          }

          { entry !== editing &&
            <AvailabilityView
              errored={!!erroredIndexes && erroredIndexes.includes(index)}
              form={entry}
              onDelete={onDeleteForm}
              onEdit={onEdit}
              data-cy={`${dataCy}:${index}`}
            />
          }
        </Fragment>
      )}
    </main>
  )
}

export default AvailabilitySelector;
