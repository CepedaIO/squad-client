import {gql, useMutation} from "@apollo/client";

export const useCreateEvent = () => useMutation(gql`
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
