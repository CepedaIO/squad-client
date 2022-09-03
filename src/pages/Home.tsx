import {useNavigate} from "react-router-dom";
import {apiGetEventSummaries} from "../services/api/event";
import {Duration} from "luxon";
import React from "react";

const Home = () => {
  const navigate = useNavigate();
  const { data } = apiGetEventSummaries();

  const events = !data ? [] : data.map((event) => (
    <section className={'shadow-xl max-w-xs p-2 cursor-pointer'} key={event.id} onClick={() => navigate(`/event/${event.id}`)}>
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
        src={event.img}
        className={'mb-6'}
      />
    </section>
  ));

  return (
  <main>
    <section className={'mb-8'}>
      <h1 className={'mb-5 center'}>
        Events

        <i
          className="fa-solid fa-circle-plus ml-3 text-submit cursor-pointer"
          onClick={() => navigate('/event/new')}
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
