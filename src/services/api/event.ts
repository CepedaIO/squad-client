import {gql, useMutation, useQuery} from "@apollo/client";
import {IEvent, IEventSummary, IInviteSummary, ICreateEventInput, Availability, Demote, IInviteMemberInput, ISimpleResponse} from "event-matcher-shared";

export const apiGetEvent = (id: number) => {
  const useQuery1 = useQuery<{ getEvent: Demote<IEvent> }>(gql`
    query GetEvent($id: Float!) {
      getEvent(id: $id) {
        id
        createdOn
        modifiedOn
        name
        img
        description
        duration {
          days
          hours
          minutes
        }
        memberships {
          id
          createdOn
          modifiedOn
          email
          displayName
          permissions {
            id
            createdOn
            modifiedOn
            membershipId
            isAdmin
          }
          availabilities {
            id
            createdOn
            modifiedOn
            start
            end
          }
        }
      }
    }
  `, {
    variables: { id }
  });

  const data = !useQuery1.data ? useQuery1.data : {
    ...useQuery1.data.getEvent,
    memberships: useQuery1.data.getEvent.memberships.map((membership) => ({
      ...membership,
      availabilities: Availability.promote(membership.availabilities)
    }))
  }

  return {
    ...useQuery1,
    data
  };
}

export interface GetSummaries {
  getInviteSummaries: Demote<IInviteSummary>[];
  getEventSummaries: Demote<IEventSummary>[];
}
export const GET_SUMMARIES = gql`
  query GetSummaries {
    getInviteSummaries {
      uuid
      key
      from
      event {
        id
        name
      }
      expiresOn
    }

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
`;

export const apiCreateEvent = () => useMutation<IEvent, Payload<ICreateEventInput>>(gql`
  mutation CreateEvent($payload: CreateEventInput!) {
    createEvent(payload: $payload) { id }
  }
`, {
  refetchQueries: [
    {query: GET_SUMMARIES}
  ]
});

export const apiCreateInvite = () =>
  useMutation<{ inviteMember: ISimpleResponse }, Payload<IInviteMemberInput>>(gql`
    mutation InviteMember($payload: InviteMemberInput!) {
      inviteMember(payload: $payload) {
        success
        result
      }
    }
  `);
