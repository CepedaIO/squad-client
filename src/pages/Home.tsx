import {useNavigate} from "react-router-dom";
import {GET_SUMMARIES, GetSummaries} from "../services/api/event";
import React from "react";
import EventCard from "../components/event/EventCard";
import {useQuery} from "@apollo/client";
import InviteSummary from "../components/event/InviteSummary";

const Home = () => {
  const navigate = useNavigate();
  const { data } = useQuery<GetSummaries>(GET_SUMMARIES);

  const events = !data ? [] : data.getEventSummaries.map((event, index) =>
    <EventCard
      event={event}
      data-cy={`event:card:${index}`}
    />
  );

  const invites = !data ? [] : data.getInviteSummaries.map((invite, index) => (
    <InviteSummary
      invite={invite}
      data-cy={`invite:summary:${index}`}
    />
  ));

  return (
    <main className={'w-full'}>
      <section className={'mb-8'}>
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
            data-cy={'create:group'}
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
