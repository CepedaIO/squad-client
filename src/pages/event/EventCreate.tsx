import Button from "../../components/inline/Button";
import Calendar from "../../components/calendar";
import React, {useEffect, useState} from "react";
import AvailabilitySelector from "../../components/availability/AvailabilitySelector";
import FormContext, {createFormContext} from "../../providers/FormContext";
import line from "../../services/input-types/line";
import multiline from "../../services/input-types/multiline";
import useForm from "../../hooks/useForm";
import {useFormControls} from "../../hooks/useFormControls";
import {DurationLike} from "../../services/input-types/duration/durationLike";
import {DateTime, DurationLikeObject} from "luxon";
import $c from "classnames";
import {AvailabilityValidation, ICreateEventInput, IAvailabilityBase} from "event-matcher-shared";
import {apiCreateEvent, GET_SUMMARIES} from "../../services/api/event";
import {useApp} from "../../hooks/useApp";
import useDebounce from "../../hooks/useDebounce";
import Split from "../../components/Split";

const labelFrom = (duration: DurationLikeObject) => `${Object.keys(duration)[0]} ${Object.values(duration)[0]}`;

const EventCreateContent = () => {
  const {
    err: { addErrors },
    notif: { addNotice },
    nav: { navigate }
  } = useApp();
  const [currentMonth, setCurrentMonth] = useState<number>(DateTime.now().month);
  const { validate, setValue, getError, values:{ availabilities, eventAvailabilities, duration, img, anytime }, setValidation } = useForm<ICreateEventInput>();
  const { FormInput } = useFormControls<ICreateEventInput>();
  const [mutCreateEvent, { data, error, loading } ] = apiCreateEvent();
  const debounceRead = useDebounce((val) => val, 500);
  
  const availabilityError = getError('availabilities');
  const eventAvailabilityError = getError('eventAvailabilities');
  const invalidAvailability = AvailabilityValidation.durationInvalidIndexes(availabilities, duration);
  const invalidEventAvailability = AvailabilityValidation.durationInvalidIndexes(eventAvailabilities, duration);

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
        timeout: 10000
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
  
  setValidation('eventAvailabilities', {
    ist: AvailabilityValidation.ist,
    validator: ({anytime}, {required}) => [
      [(value) => anytime === true || value.length > 0, 'Must select availability'],
      required('duration', [
        [() => invalidEventAvailability.length === 0, `Invalid availabilities: ${labelFrom(duration)}`]
      ])
    ],
  }, [JSON.stringify(invalidEventAvailability), duration]);

  const onClickSubmit = () => {
    const [isValid, payload] = validate();
    
    if(isValid) {
      return mutCreateEvent({
        variables: { payload },
        refetchQueries: [
          { query: GET_SUMMARIES }
        ]
      });
    }
  };

  const onChangeAvailability = (availability: IAvailabilityBase[]) =>
    setValue('availabilities', () => availability);
  const onChangeEventAvailability = (availability: IAvailabilityBase[]) =>
    setValue('eventAvailabilities', () => availability)
  
  const onClickBack = () => navigate('/home');

  return (
    <main className="flex flex-col">
      <header
        className={'mb-4 cursor-pointer'}
        onClick={onClickBack}
      >
        <i className="fa-solid fa-chevron-left mr-3"></i>
        <span>Back</span>
      </header>
      
      <div className="mx-auto flex flex-col w-full max-w-screen-sm">
        <h2 className={"mb-3"}>Event Info:</h2>
        <FormInput
          label={"Name:"}
          field={"name"}
          type={line}
        />

        <FormInput
          label={"Image:"}
          field={"img"}
          type={line}
        />

        <img
          className={'w-full h-[250px] bg-slight mb-4'}
          src={debounceRead(img)}
          alt={'Event image'}
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
        
        <Split
          nowrap={true}
          className={'mb-5'}
          left={<label>Anytime?</label>}
          right={
            <Button
              variant={"toggle"}
              active={anytime}
              onChange={(val: boolean) => setValue('anytime', () => val)}
              data-cy={'anytime'}
            />
          }
        />
  
        { !anytime && <>
          <AvailabilitySelector
            erroredIndexes={invalidEventAvailability}
            offset={duration}
            availabilities={eventAvailabilities}
            onChange={onChangeEventAvailability}
            data-cy={'event'}
          />
  
          { eventAvailabilityError  && (
            <section className={$c('text-error text-center mb-4')}>
              { eventAvailabilityError.message }
            </section>
          )}
  
          <Calendar
            availabilities={eventAvailabilities}
            month={currentMonth}
            shouldChange={(month: number) => setCurrentMonth(month) }
          />
        </>}

        <h2 className={"mb-3"}>Member Info:</h2>
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
          data-cy={'member'}
        />

        { availabilityError  && (
          <section className={$c('text-error text-center mb-4')}>
            { availabilityError.message }
          </section>
        )}

        <Calendar
          availabilities={availabilities}
          month={currentMonth}
          shouldChange={(month: number) => setCurrentMonth(month) }
          highlight={eventAvailabilities}
        />

        <Button
          className={"mt-8"}
          variant={"submit"}
          onClick={onClickSubmit}
          data-cy={'submit:event'}
          disabled={loading}
        >
          Submit
        </Button>
      </div>
    </main>
  )
}

const EventCreate = () => {
  const context = createFormContext<ICreateEventInput>({
    name: '',
    img: '',
    description: '',
    duration: { hours: 1 },
    displayName: '',
    availabilities: [],
    eventAvailabilities: [],
    anytime: false
  });

  return (
    <FormContext.Provider value={ context }>
      <EventCreateContent />
    </FormContext.Provider>
  )
}

export default EventCreate;
