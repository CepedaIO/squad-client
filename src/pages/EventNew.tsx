import Button from "../components/inline/Button";
import Calendar from "../components/calendar";
import React, {useEffect} from "react";
import AvailabilitySelector from "../components/availability/AvailabilitySelector";
import FormContext, {createFormContext} from "../providers/FormContext";
import line from "../services/input-types/line";
import multiline from "../services/input-types/multiline";
import useForm from "../hooks/useForm";
import {useFormControls} from "../hooks/useFormControls";
import {DurationLike} from "../services/input-types/duration/durationLike";
import {DurationLikeObject} from "luxon";
import $c from "classnames";
import {IAvailability, AvailabilityValidation, ICreateEventForm} from "event-matcher-shared";
import {useCreateEvent} from "../services/api/event";
import {useApp} from "../hooks/useApp";
import {omit} from "lodash";

const labelFrom = (duration: DurationLikeObject) => `${Object.keys(duration)[0]} ${Object.values(duration)[0]}`;

const EventNewContent = () => {
  const {
    err: { addErrors },
    notif: { addNotice },
    nav: { navigate }
  } = useApp();
  const { validate, setValue, getError, values:{ availabilities, duration }, setValidation } = useForm<ICreateEventForm>();
  const { FormInput } = useFormControls<ICreateEventForm>();
  const availabilityError = getError('availabilities');
  const invalidAvailability = AvailabilityValidation.durationInvalidIndexes(availabilities, duration);
  const [mutCreateEvent, { data, error, loading } ] = useCreateEvent();

  useEffect(() => {
    if(error) {
      addErrors({
        field: 'createEvent',
        message: error.message
      });
    }

    if(data) {
      addNotice({
        id: 'Created Event',
        message: 'You have created an event!',
        level: 'success',
        dismissable: true,
      });

      navigate('/home');
    }
  }, [error, data]);

  setValidation('availabilities', {
    ist: AvailabilityValidation.ist,
    validator: (_, {required}) => [
      [(value) => value.length > 0, 'Must select availability'],
      required('duration', [
        [() => invalidAvailability.length === 0, `Invalid availabilities: ${labelFrom(duration)}`]
      ])
    ],
  }, [JSON.stringify(invalidAvailability), duration]);

  const onClickSubmit = () => {
    const [isValid, payload] = validate();
    if(isValid) {
      return mutCreateEvent({
        variables: {
          payload: {
            ...omit(payload, 'duration'),
            precision: Object.keys(payload.duration)[0],
            factor: Object.values(payload.duration)[0]
          }
        }
      });
    }
  };

  const onChangeAvailability = (availability: IAvailability[]) =>
    setValue('availabilities', () => availability)

  return (
    <main className="flex flex-col h-full">
      <div className="mx-auto flex flex-col gap-6 w-full max-w-screen-sm">
        <h2>Event Info:</h2>
        <FormInput
          label={"Name:"}
          field={"name"}
          type={line}
        />

        <FormInput
          label={"Description:"}
          field={"description"}
          type={multiline}
        />

        <FormInput
          label={"Duration:"}
          field={"duration"}
          type={DurationLike}
        />

        <h2>Member Info:</h2>
        <FormInput
          label={"Display Name:"}
          field={"displayName"}
          type={line}
        />

        <AvailabilitySelector
          erroredIndexes={invalidAvailability}
          offset={duration}
          availabilities={availabilities}
          onChange={onChangeAvailability}
        />

        { availabilityError  && (
          <section className={$c('text-error text-center')}>
            { availabilityError.message }
          </section>
        )}

        <Calendar
          availabilities={availabilities}
        />

        <Button
          className={"mt-2"}
          variant={"submit"}
          onClick={onClickSubmit}
          data-cy={'submit'}
          disabled={loading}
        >
          Submit
        </Button>
      </div>
    </main>
  )
}

const EventNew = () => {
  const context = createFormContext<ICreateEventForm>({
    name: '',
    description: '',
    duration: { hours: 1 },
    displayName: '',
    availabilities: []
  });

  return (
    <FormContext.Provider value={ context }>
      <EventNewContent />
    </FormContext.Provider>
  )
}

export default EventNew;
