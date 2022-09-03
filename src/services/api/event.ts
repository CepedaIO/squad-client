import {gql, useMutation, useQuery} from "@apollo/client";
import {IEvent, IEventSummary, ICreateEventInput, AsMut} from "event-matcher-shared";

export const apiGetEventSummaries = () => {
  const useQuery1 = useQuery<{ getEventSummaries: IEventSummary[] }>(gql`
    query GetEventSummaries {
        getEventSummaries {
        id
        name
        img
        duration {
          days
          minutes
          hours
        }
        admin {
          displayName
        }
      }
    }
  `)

  return {
    ...useQuery1,
    data: useQuery1.data ? useQuery1.data.getEventSummaries : useQuery1.data
  };
}

export const apiCreateEvent = () => useMutation<IEvent, Payload<ICreateEventInput>>(gql`
  mutation CreateEvent($payload: CreateEventInput!) {
    createEvent(payload: $payload) { id }
  }
`);
