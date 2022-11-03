import line from "../../services/input-types/line";
import AvailabilitySelector from "../availability/AvailabilitySelector";
import $c from "classnames";
import Calendar from "../calendar";
import React, {useMemo, useState} from "react";
import {useFormControls} from "../../hooks/useFormControls";
import {DateTime, Duration, DurationLikeObject} from "luxon";
import {AvailabilityValidation, TextValidation, IAvailabilityBase, promote} from "squad-shared";
import useForm from "../../hooks/useForm";
import {useQuery} from "@apollo/client";
import {AVAILABILITIES_FOR_EVENT, AvailabilitiesForEvent} from "../../services/api/availability";

export interface IMembershipEditProps {
  duration: Duration,
  eventId: number;
  onChange: (form: IMembershipForm) => void
}

export interface IMembershipForm {
  displayName: string;
  availabilities: IAvailabilityBase[]
}

const MembershipEdit = ({
  duration, eventId
}: IMembershipEditProps) => {
  const [currentMonth, setCurrentMonth] = useState<number>(DateTime.now().month);
  const { setValue, getError, values:{ availabilities }, setValidation } = useForm<IMembershipForm>();
  const { FormInput } = useFormControls<IMembershipForm>();
  const invalidAvailability = AvailabilityValidation.durationInvalidIndexes(availabilities, duration);
  const availabilityError = getError('availabilities');
  
  const labelFrom = (duration: DurationLikeObject) => `${Object.keys(duration)[0]} ${Object.values(duration)[0]}`;
  
  const { data: GetEventAvailabilities } = useQuery<AvailabilitiesForEvent>(AVAILABILITIES_FOR_EVENT, {
    variables: {
      eventId,
      start: DateTime.fromObject({ month: currentMonth }).startOf('month'),
      end: DateTime.fromObject({ month: currentMonth }).endOf('month')
    }
  });
  
  const eventAvailabilities = useMemo(() => promote(GetEventAvailabilities?.availabilityForEvent || []), [GetEventAvailabilities]);
  
  setValidation('availabilities', {
    ist: AvailabilityValidation.ist,
    validator: () => [
      [(value) => value.length > 0, 'Must select availability'],
      [() => invalidAvailability.length === 0, `Invalid availabilities: ${labelFrom(duration)}`]
    ],
  }, [JSON.stringify(invalidAvailability)]);
  
  const onChangeAvailability = (availability: IAvailabilityBase[]) =>
    setValue('availabilities', () => availability)
  
  return (
    <section>
      <FormInput
        label={"Display Name:"}
        field={"displayName"}
        type={line}
        validator={() => [
          [TextValidation.defined, 'Must provide a display name'],
          [TextValidation.greaterThan(3), 'Display name must be greater than 3 characters']
        ]}
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
        secondary={eventAvailabilities}
        month={currentMonth}
        shouldChange={setCurrentMonth}
      />
    </section>
  )
}

export default MembershipEdit;
