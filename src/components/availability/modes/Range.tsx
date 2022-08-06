import Button from "../../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import {DateTime, Interval} from "luxon";
import Date from "../../../services/input-types/date";
import Time from "../../../services/input-types/time";
import useForm from "../../../hooks/useForm/index";
import {ist} from "../../../services/utils";
import Datetime from "../../../services/input-types/datetime";

export interface RangeForm {
  start: DateTime;
  end: DateTime;
}

export const isRangeForm = ist<RangeForm>(obj => DateTime.isDateTime(obj.start) && DateTime.isDateTime(obj.end));

export interface RangeViewProps {
  form: RangeForm;
  onDelete: (form: RangeForm) => void;
  onEdit: (form: RangeForm) => void;
}

export const RangeView = ({
  form, onDelete, onEdit
}: RangeViewProps) => {
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
          { form.start.toFormat('LLLL dd') }
        </div>


        <div>
          { form.start.toFormat('T') } {'->'} { form.end.toFormat('T') }
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

interface RangeEditProps {
  form?: Partial<RangeForm>;
  onSubmit(form: RangeForm): void;
  onCancel(form?: Partial<RangeForm>): void;
}

export const RangeEdit = ({
  form, onSubmit, onCancel
}: RangeEditProps) => {
  const {validate, values, FormInput, FormToggle} = useForm<RangeForm>(form);

  const onClickAdd = () => {
    const [valid, values] = validate();
    if(valid) { onSubmit(values); }
  };

  const onClickCancel = () => onCancel(values);

  return (
    <main className={$c('flex flex-col gap-3')}>
      <FormInput
        label={"Start"}
        field={"start"}
        type={Datetime}
        nowrap={true}
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
        type={Datetime}
        nowrap={true}
        validator={({ start }, { required }) => [
          [Date.defined, 'Must pick a time'],
          required('start', [
            [Time.greaterThan(start, 1, 'hour'), 'Must be at least 1 hour after start']
          ])
        ]}
      />

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
