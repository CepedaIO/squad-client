import {gql, useMutation} from "@apollo/client";
import {IEvent, IInviteToken, ICreateEventInput, Demote, IInviteMemberInput, ISimpleResponse, IMembership} from "event-matcher-shared";

export interface GetEvent {
  event: Demote<IEvent>;
}
export const GET_EVENT = gql`
  query GetEvent($id: Float!) {
    event(id: $id) {
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
`;

export interface GetEventFromInvite {
  eventFromInvite: Pick<IEvent, 'id' | 'img' | 'name' | 'duration'>
}
export const GET_EVENT_FROM_INVITE = gql`
  query GetEventFromInvite($uuid: String!, $key: String!) {
    eventFromInvite(uuid: $uuid, key: $key){
      id
      img
      name
      duration {
        hours
        days
        minutes
      }
    }
  }
`;

export interface GetSummaries {
  user: {
    invites: Array<
      Demote<Pick<IInviteToken, 'id' | 'uuid' | 'key' | 'expiresOn'>> & {
        event: Pick<IEvent, 'id' | 'name'>
      }
    >,
    events: Array<
      Demote<Pick<IEvent, 'id' | 'name' | 'img' | 'duration'>> & {
        admins: Pick<IMembership, 'displayName'>[]
      }
    >
  }
}
export const GET_SUMMARIES = gql`
  query GetSummaries {
    user {
      invites {
        id
        uuid
        key
        expiresOn
        event {
          id
          name
        }
      }
      
      events {
        id
        name
        img
        duration {
          days
          minutes
          hours
        }
        admins {
          displayName
        }
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
