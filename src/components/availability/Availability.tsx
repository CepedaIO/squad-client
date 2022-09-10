import {Range} from "./modes/Range";
import React, {Fragment, useState} from "react";
import $c from "classnames";
import Button from "../inline/Button";
import {DurationLikeObject} from "luxon";
import useForm from "../../hooks/useForm";
import FormContext, {createFormContext} from "../../providers/FormContext";
import {IAvailability} from "event-matcher-shared";

export const modes = [Range];

export interface IAvailabilityMode {
  applies: (form: IAvailability) => boolean;
  label: string;
  View: (props: AvailabilityViewProps) => JSX.Element;
  Edit: (props: AvailabilityEditProps) => JSX.Element;
}

export interface AvailabilityViewProps {
  errored: boolean;
  form: IAvailability;
  onDelete: (form: IAvailability) => void;
  onEdit: (form:IAvailability) => void;
}

export const AvailabilityView = (props: AvailabilityViewProps) => {
  const {onDelete, onEdit, form, errored} = props;
  const [active, setActive] = useState(false);
  const iconClasses = 'flex-1 text-center p-2 cursor-pointer';
  const onClickDelete = () => onDelete(form);
  const onClickEdit = () => onEdit(form);
  const onClick = () => setActive(!active);

  return (
    <main>
      <div
        onClick={onClick}
        className={$c({
          'p-[2px]': !errored,
          'border-error border-2': errored
        })}
      >
        { modes.find((mode) => mode.applies(props.form))!.View(props) }
      </div>

      { active &&
        <section
          className={$c('flex flex-row items-center justify-around') }
        >
          <div
            onClick={onClickDelete}
            className={$c(iconClasses, 'text-reject')}
          >
            <i className="fa-solid fa-trash-can"></i>
          </div>
          <div
            onClick={onClickEdit}
            className={$c(iconClasses, 'text-active')}
          >
            <i className="fa-solid fa-pen-to-square"></i>
          </div>
        </section>
      }
    </main>
  );
}

export interface AvailabilityEditProps {
  offset: DurationLikeObject;
  form?: Partial<IAvailability>;
  onSubmit: (form: IAvailability) => void;
  onCancel: (form?: Partial<IAvailability>) => void;
}

const AvailabilityEditContent = (props: AvailabilityEditProps) => {
  const {onSubmit, onCancel} = props;
  const {validate, values} = useForm<IAvailability>();
  const [activeMode, setActiveTab] = useState(modes[0]);

  const onClickAdd = () => {
    const [valid, values] = validate();
    if(valid) { onSubmit(values); }
  };

  const onClickCancel = () => onCancel(values);
  return (
    <main>
      <section className={$c('grid grid-cols-3 mb-8')}>
        { modes.map((mode) =>
          <Button
            variant={"tab"}
            active={mode === activeMode}
            key={mode.label}
            onClick={() => setActiveTab(mode)}
            data-cy={mode.label}
          >
            { mode.label }
          </Button>
        )}
      </section>

      { modes.map((mode) =>
        activeMode !== mode ? null : (
          <Fragment key={mode.label}>
            { mode.Edit(props) }
          </Fragment>
        )
      )}

      <footer className={$c('center grow-children')}>
        <Button
          variant={"link"}
          onClick={onClickCancel}
        >
          Cancel
        </Button>
        <Button
          variant={"link"}
          onClick={onClickAdd}
          data-cy={"submit:availability"}
        >
          Save
        </Button>
      </footer>
    </main>
  );
}

export const AvailabilityEdit = (props: AvailabilityEditProps) => {
  const context = createFormContext(props.form);

  return (
    <FormContext.Provider value={ context }>
      <AvailabilityEditContent { ...props } />
    </FormContext.Provider>
  );
}
