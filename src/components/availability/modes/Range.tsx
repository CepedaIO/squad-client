import Button from "../../inline/Button";
import React, {useState} from "react";
import $c from "classnames";
import {DateTime, Duration, DurationLikeObject} from "luxon";
import useForm from "../../../hooks/useForm";
import {DateAndTime} from "../../../services/input-types/datetime";
import {useFormControls} from "../../../hooks/useFormControls";
import FormContext, {createFormContext} from "../../../providers/FormContext";

export interface RangeForm {
  start: DateTime;
  end: DateTime;
}

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
        className={$c('py-3 md:px-3 flex flex-row justify-between items-center cursor-pointer') }
      >
        <div className={'flex flex-col items-center'}>
          <span>{ form.start.toFormat('LLLL dd') }</span>
          <span>{ form.start.toFormat('T') }</span>
        </div>

        <span>{'->'}</span>

        <div className={'flex flex-col items-center'}>
          <span>{ form.end.toFormat('LLLL dd') }</span>
          <span>{ form.end.toFormat('T') }</span>
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
  limit: DurationLikeObject;
  form?: Partial<RangeForm>;
  onSubmit(form: RangeForm): void;
  onCancel(form?: Partial<RangeForm>): void;
}

export const RangeEditContent = ({
  limit, onSubmit, onCancel
}: RangeEditProps) => {
  const {validate, values} = useForm<RangeForm>();
  const {FormInput} = useFormControls<RangeForm>();
  const readableDuration = Duration.fromDurationLike(limit).toHuman();

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
        type={DateAndTime}
        nowrap={true}
        validator={[
          ({ end }, { required }) => [
            [DateAndTime.defined, 'Must pick a time'],
            required('end', [
              [DateAndTime.lessThan(end, limit), `Must be at least ${readableDuration} before end`]
            ])
          ], [limit]
        ]}
      />

      <FormInput
        label={"End"}
        field={"end"}
        type={DateAndTime}
        nowrap={true}
        validator={[
          ({ start }, { required }) => [
            [DateAndTime.defined, 'Must pick a time'],
            required('start', [
              [DateAndTime.greaterThan(start, limit), `Must be at least ${readableDuration} after start`]
            ])
          ], [limit]
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

export const RangeEdit = (props: RangeEditProps) => {
  const context = createFormContext(props.form);

  return  <FormContext.Provider value={ context }>
    <RangeEditContent { ...props } />
  </FormContext.Provider>
}
