import {Duration} from "luxon";
import React from "react";
import {useNavigate} from "react-router-dom";
import {IEvent, IMembership} from "../../services/api/event";

interface EventCardProps {
  event: Pick<IEvent, 'id' | 'name' | 'duration' | 'img'>;
  admin: Pick<IMembership, 'displayName'>;
  'data-cy': string;
}

const EventCard = (props: EventCardProps) => {
  const {event, admin} = props;
  const navigate = useNavigate();
  
  return <main
    className={'shadow-xl max-w-[200px] p-2 cursor-pointer event-card'}
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
      Admin: {admin.displayName}
    </div>
    
    <img
      alt={'Event Image'}
      src={event.img}
      className={'mb-6'}
    />
  </main>
}

export default EventCard;
