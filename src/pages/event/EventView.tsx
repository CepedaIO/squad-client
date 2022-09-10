import {useNavigate, useParams} from "react-router-dom";
import Cat from "../../components/Cat";
import {apiGetEvent} from "../../services/api/event";
import {isNaN} from "lodash";
import Calendar from "../../components/calendar";
import React, {useState} from "react";
import InviteMember, {IInviteMemberForm} from "../../components/event/InviteMember";

const EventView = () => {
  const [showInvite, setInvite] = useState(false);
  const [invites, setInvites] = useState<IInviteMemberForm[]>([]);
  const navigate = useNavigate();
  const { id: _id } = useParams();

  if(!_id || isNaN(_id)) {
    navigate('/home');
  }

  const id = parseInt(_id!);

  const { data: event, loading } = apiGetEvent(id);
  const onClickBack = () => navigate('/home');
  
  const onSubmitInvite = (invite: IInviteMemberForm) => setInvites((prev) => [...prev, invite]);
  
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
            data-cy={'invite:create'}
          />
        </div>

        { showInvite &&
          <InviteMember onSubmit={ onSubmitInvite } />
        }
  
        { invites.length > 0 && (
          <section>
            Pending Invites { invites.length }
          </section>
        )}
        
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
