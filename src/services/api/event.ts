import {gql, useMutation} from "@apollo/client";
import {IEvent, ICreateEventInput} from "event-matcher-shared";

export const useCreateEvent = () => useMutation<IEvent, Payload<ICreateEventInput>>(gql`
  mutation createEvent($payload: CreateEventInput!) {
    createEvent(payload: $payload) {
      id
      createdOn
      modifiedOn
      name
      description
      precision
      factor
      memberships {
        id
        createdOn
        email
        displayName
        availability {
          id
          createdOn
          modifiedOn
          start
          end
        }
      }
    }
  }
`);
