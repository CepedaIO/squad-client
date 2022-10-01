import {Duration} from "luxon";
import React from "react";
import {IEventSummary} from "event-matcher-shared";
import {useNavigate} from "react-router-dom";

interface EventCardProps {
  event: IEventSummary;
  'data-cy': string;
}

const EventCard = (props: EventCardProps) => {
  const { event } = props;
  const navigate = useNavigate();
  
  return <main
    className={'shadow-xl max-w-xs p-2 cursor-pointer event-card'}
    key={event.id}
    onClick={() => navigate(`/event/${event.id}`)}
    data-cy={props['data-cy']}
  >
    <header className={'text-center font-bold'}>
      {event.name}
      </header>
      
      <div className={'mt-3'}>
      Duration: {Duration.fromDurationLike(event.duration).toHuman()}
    </div>
    
    <div className={'mb-4'}>
      Admin: {event.admin.displayName}
    </div>
    
    <img
      alt={'Event Image'}
      src={event.img}
      className={'mb-6'}
    />
  </main>
}

export default EventCard;
