import {gql, useMutation} from "@apollo/client";
import {
  IEventEntity,
  IInviteTokenEntity,
  ICreateEventInput,
  Demote,
  IInviteMemberInput,
  ISimpleResponse,
  IMembershipEntity,
  IMembershipPermissionsEntity,
  IAvailabilityEntity,
  IJoinLinkEntity,
  IPendingMembershipEntity
} from "event-matcher-shared";

export interface IInviteToken extends IInviteTokenEntity {
  event: IEvent
}

export interface IMembershipPermissions extends IMembershipPermissionsEntity {

}

export interface IAvailability extends IAvailabilityEntity {

}

export interface IMembership extends IMembershipEntity {
  permissions: IMembershipPermissions;
  availabilities: IAvailability[];
}

export interface IEvent extends IEventEntity {
  memberships: IMembership[];
  pendingMemberships: IPendingMembership[];
  admins: IMembership[];
  user: IMembership;
  joinLink: string;
}

export interface IJoinLink extends IJoinLinkEntity {

}

export interface IPendingMembership extends IPendingMembershipEntity {
  event: IEvent;
}

export interface GetEvent {
  event: Demote<Omit<IEvent, 'user' | 'admins' | 'pendingMemberships'> & {
    user: {
      permissions: Pick<IMembershipPermissions, 'isAdmin'>
    },
    pendingMemberships: Array<Pick<IPendingMembership, 'id' | 'displayName'>>
  }>
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
      joinLink
      duration {
        days
        hours
        minutes
      }
      user {
        permissions {
          isAdmin
        }
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
      pendingMemberships {
        id
        displayName
      }
    }
  }
`;

export interface GetEventFromInvite {
  invite: Pick<IInviteToken, 'id'> & {
    event: Pick<IEvent, 'id' | 'img' | 'name' | 'duration'>
  }
}
export const GET_EVENT_FROM_INVITE = gql`
  query GetEventFromInvite($uuid: String!, $key: String!) {
    invite(uuid: $uuid, key: $key){
      id
      event {
        img
        name
        duration {
          hours
          days
          minutes
        }
      }
    }
  }
`;

export interface GetEventFromJoinLink {
  joinLink: Pick<IJoinLink, 'id'> & {
    event: Pick<IEvent, 'id' | 'img' | 'name' | 'description' | 'duration'>
  }
}
export const GET_EVENT_FROM_JOIN = gql`
  query GetEventFromJoin($key: String!) {
    joinLink(key: $key){
      id
      event {
        id
        img
        name
        description
        duration {
          hours
          days
          minutes
        }
      }
    }
  }
`;

export interface GetSummaries {
  user: {
    invites: Array<Demote<Pick<IInviteToken, 'id' | 'uuid' | 'key' | 'expiresOn'>> & {
      event: Pick<IEvent, 'id' | 'name'>
    }>,
    events: Array<Pick<IEvent, 'id' | 'name' | 'img' | 'duration'> & {
      admins: Pick<IMembership, 'displayName'>[]
    }>,
    pendingMemberships: Array<Pick<IPendingMembership, 'displayName'> & {
      event: Pick<IEvent, 'id' | 'name'>
    }>
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
      
      pendingMemberships {
        displayName
        event {
          id
          name
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
