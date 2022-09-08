import {useNavigate, useParams} from "react-router-dom";
import Cat from "../../components/Cat";
import {apiGetEvent} from "../../services/api/event";
import {isNaN} from "lodash";
import Calendar from "../../components/calendar";
import React, {useState} from "react";
import {useFormControls} from "../../hooks/useFormControls";
import line from "../../services/input-types/line";
import multiline from "../../services/input-types/multiline";
import $c from "classnames";
import Button from "../../components/inline/Button";

const EventView = () => {
  const [showInvite, setInvite] = useState(true);
  const { FormInput } = useFormControls();
  const navigate = useNavigate();
  const { id: _id } = useParams();

  if(!_id || isNaN(_id)) {
    navigate('/home');
  }

  const id = parseInt(_id!);

  const { data: event, loading } = apiGetEvent(id);
  const onClickBack = () => navigate('/home');

  if(loading) {
    return (
      <main className={'flex flex-col items-center'}>
        <h1 className={'mb-8'}>Loading ...</h1>

        <Cat />
      </main>
    )
  }

  if(event) {
    return (
      <main>
        <header className={'mb-4'}>
          <i className="fa-solid fa-chevron-left mr-3"></i>
          <span className={'cursor-pointer'} onClick={onClickBack}>Back</span>
        </header>
        <h1 className={'mb-8'}>{ event.name }</h1>

        <img
          className={'w-[250px] h-[200px] mb-5'}
          src={event.img}
        />

        <div className={'mb-5'}>
          { event.description }
        </div>

        <div>
          Users

          <i
            className="fa-solid fa-circle-plus ml-3 text-submit cursor-pointer"
            onClick={() => setInvite(true)}
            data-cy={'user:invite'}
          />
        </div>

        <section>
          <FormInput
            label={"Email:"}
            field={"email"}
            type={line}
          />

          <FormInput
            label={"Message:"}
            field={"message"}
            type={multiline}
          />

          <footer className={$c('center grow-children')}>
            <Button
              variant={"link"}
            >
              Cancel
            </Button>

            <Button
              variant={"link"}
              data-cy={"submit:availability"}
            >
              Invite
            </Button>
          </footer>
        </section>

        { event.memberships.map((member) => (
          <section key={member.email} className={'max-w-xs'}>
            <h2 className={'font-bold text-center text-md mb-5'}>{ member.displayName }</h2>

            <Calendar availabilities={member.availabilities} />
          </section>
        ))}
      </main>
    )
  }

  return (
    <main>
      What the cat?
    </main>
  )
}

export default EventView;
