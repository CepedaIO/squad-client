import {gql} from "@apollo/client";
import {IRangeForm, Demote} from "squad-shared";

export type AvailabilitiesForEvent = {
  availabilityForEvent: Array<Demote<IRangeForm>>
};
export const AVAILABILITIES_FOR_EVENT = gql`
  query AvailabilityForEvent($eventId: Float!, $start: DateTime!, $end: DateTime!) {
    availabilityForEvent(eventId: $eventId, start: $start, end: $end) {
      start
      end
    }
  }
`;
