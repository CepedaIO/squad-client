import {DateTime, Duration} from "luxon";
import React from "react";
import {useNavigate} from "react-router-dom";
import {IEvent, IMembership} from "../../services/api/event";

interface EventCardProps {
  event: Pick<IEvent, 'id' | 'name' | 'duration' | 'img' | 'resolution' | 'description'>;
  'data-cy': string;
}

const EventCard = (props: EventCardProps) => {
  const {event} = props;
  const navigate = useNavigate();
  
  return <main
    className={'shadow-2xl max-w-[250px] h-[335px] cursor-pointer event-card border rounded flex flex-col'}
    key={event.id}
    onClick={() => navigate(`/event/${event.id}`)}
    data-cy={props['data-cy']}
  >
    <header className={'text-center font-bold text-xl mt-2'}>
      {event.name}
    </header>
    
    <section className={'p-2'}>
      <div className={'mb-1 center'}>
        <div className={'font-bold'}>Duration</div>
        <div className={'text-submit ml-auto'}>{ Duration.fromDurationLike(event.duration).toHuman() }</div>
      </div>
  
      {event.resolution &&
        <div className={'mb-4'}>
          <div className={'mb-1 center'}>
            <div className={'font-bold'}>Start</div>
            <div className={'text-submit ml-auto'}>{ event.resolution!.start.toLocaleString(DateTime.DATETIME_SHORT) }</div>
          </div>
          <div className={'mb-1 center'}>
            <div className={'font-bold'}>End</div>
            <div className={'text-submit ml-auto'}>{ event.resolution!.end.toLocaleString(DateTime.DATETIME_SHORT) }</div>
          </div>
        </div>
      }
  
      {!event.resolution &&
        <div className={'mt-3'}>
          { event.description }
        </div>
      }
    </section>
    
    <img
      alt={'Event Image'}
      className={'mt-auto'}
      src={event.img}
    />
  </main>
}

export default EventCard;
