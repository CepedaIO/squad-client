import {gql, useMutation} from "@apollo/client";
import {IEvent, ICreateEventInput} from "event-matcher-shared";

export const useCreateEvent = () => useMutation<IEvent, Payload<ICreateEventInput>>(gql`
  mutation createEvent($payload: CreateEventInput!) {
    createEvent(payload: $payload) {
      id
      name
      description
      precision
      factor
      memberships {
        id
        email
        displayName
        availabilities {
          id
          start
          end
        }
      }
    }
  }
`);
