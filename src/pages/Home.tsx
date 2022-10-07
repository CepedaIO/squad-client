import {useNavigate} from "react-router-dom";
import {GET_SUMMARIES, GetSummaries, IEvent, IPendingMembership} from "../services/api/event";
import React from "react";
import EventCard from "../components/event/EventCard";
import {useQuery} from "@apollo/client";
import InviteSummary from "../components/event/InviteSummary";

interface PendingMembershipProps {
  pending: Pick<IPendingMembership, 'displayName'>;
  event: Pick<IEvent, 'id' | 'name'>;
  'data-cy': string;
}

const PendingMembership = (props: PendingMembershipProps) => {
  const {pending, event} = props;
  
  return (
    <main
      className={'center justify-between max-w-xs p-1 cursor-pointer'}
      data-cy={props['data-cy']}
      key={event.id}
    >
      <div>
        {event.name}
      </div>
      <div>as</div>
      <div>
        { pending.displayName }
      </div>
    </main>
  )
}

const Home = () => {
  const navigate = useNavigate();
  const { data } = useQuery<GetSummaries>(GET_SUMMARIES);

  const events = !data ? [] : data.user.events.map((event, index) =>
    <EventCard
      key={event.id}
      event={event}
      admin={event.admins[0]}
      data-cy={`event:card:${index}`}
    />
  );

  const invites = !data ? [] : data.user.invites.map((invite, index) => (
    <InviteSummary
      key={invite.uuid}
      event={invite.event}
      invite={invite}
      data-cy={`invite:summary:${index}`}
    />
  ));
  
  const pendings = !data ? [] : data.user.pendingMemberships.map((pending, index) => (
    <PendingMembership
      pending={pending}
      event={pending.event}
      data-cy={`pending:membership:${index}`}
    />
  ))

  return (
    <main className={'w-full'}>
      <section className={'mb-8'}>
        { pendings.length > 0 && (
          <section className={'mb-5'}>
            <h1 className={'mb-5 center'}>
              Pending Memberships
            </h1>
      
            <div>
              {pendings}
            </div>
          </section>
        )}
        
        { invites.length > 0 && (
          <section className={'mb-5'}>
            <h1 className={'mb-5 center'}>
              Invites
            </h1>
    
            <div>
              {invites}
            </div>
          </section>
        )}
        
        <h1
          className={'mb-5 center cursor-pointer'}
          onClick={() => navigate('/event/new')}
        >
          Events
  
          <i
            className="fa-solid fa-circle-plus ml-3 text-submit"
            data-cy={'create:event'}
          />
        </h1>
  
        { events.length > 0 && (
          <div className={'flex gap-8 flex-row flex-wrap'}>
            {events}
          </div>
        )}
      </section>
    </main>
  )
}

export default Home;
