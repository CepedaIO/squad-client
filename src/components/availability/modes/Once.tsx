import Button from "../../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import {DateTime} from "luxon";
import Date from "../../../services/input-types/date";
import Time from "../../../services/input-types/time";
import useForm from "../../../hooks/useForm/index";

export interface OnceForm {
  date: DateTime;
  allDay: boolean;
  start: DateTime;
  end: DateTime;
}

export interface OnceViewProps {
  form: OnceForm;
  onDelete: (form: OnceForm) => void;
  onEdit: (form: OnceForm) => void;
}

export const OnceView = ({
  form, onDelete, onEdit
}: OnceViewProps) => {
  const [active, setActive] = useState(false);

  const iconClasses = 'flex-1 text-center p-2 cursor-pointer';
  const onClick = () => setActive(!active);
  const onClickDelete = () => onDelete(form);
  const onClickEdit = () => onEdit(form);

  return (
    <main>
      <section
        onClick={onClick}
        className={$c('py-3 md:px-3 flex flex-row justify-between cursor-pointer') }
      >
        <div>
          { form.date.toFormat('LLLL dd') }
        </div>


        <div>
          { form.allDay && <>All Day</>}
          { !form.allDay && (
            <>
              { form.start.toFormat('T') } {'->'} { form.end.toFormat('T') }
            </>
          )}
        </div>
      </section>

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
  )
}

interface OnceEditProps {
  form?: Partial<OnceForm>;
  onSubmit(form: OnceForm): void;
  onCancel(form?: Partial<OnceForm>): void;
}

export const OnceEdit = ({
  form, onSubmit, onCancel
}: OnceEditProps) => {
  const {validate, values, FormInput, FormToggle} = useForm<OnceForm>(form);

  const onClickAdd = () => {
    const [valid, values] = validate();
    if(valid) { onSubmit(values); }
  };

  const onClickCancel = () => onCancel(values);

  return (
    <main className={$c('flex flex-col gap-3')}>
      <FormInput
        label={"When?"}
        field={"date"}
        type={Date}
        nowrap={true}
        validator={() => [
          [Date.defined, 'Must pick a date'],
          [Date.afterToday, 'Date must come after today']
        ]}
      />

      <FormToggle field={"allDay"} className={'mb-5'}>
        All day?
      </FormToggle>

      {!values.allDay && <>
        <FormInput
          label={"Start"}
          field={"start"}
          type={Time}
          nowrap={true}
          omit={({allDay}) => !!allDay}
          validator={({ end }, { required,  }) => [
            [Date.defined, 'Must pick a time'],
            required('end', [
              [Time.lessThan(end, -1, 'hour'), 'Must be at least 1 hour before end']
            ])
          ]}
        />

        <FormInput
          label={"End"}
          field={"end"}
          type={Time}
          nowrap={true}
          omit={({allDay}) => !!allDay}
          validator={({ start }, { required }) => [
            [Date.defined, 'Must pick a time'],
            required('start', [
              [Time.greaterThan(start, 1, 'hour'), 'Must be at least 1 hour after start']
            ])
          ]}
        />
      </>}

      <footer className={$c('center grow-children')}>
        <Button variant={"link"} onClick={onClickCancel}>
          Cancel
        </Button>
        <Button variant={"link"} onClick={onClickAdd}>
          Add
        </Button>
      </footer>
    </main>
  )
};
