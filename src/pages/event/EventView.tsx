import {useNavigate, useParams} from "react-router-dom";
import Cat from "../../components/Cat";
import {GET_EVENT, GetEvent} from "../../services/api/event";
import {isNaN} from "lodash";
import Calendar from "../../components/calendar";
import React, {useMemo, useState} from "react";
import InviteMember, {IInviteMemberForm} from "../../components/event/InviteMember";
import {gql, useMutation, useQuery} from "@apollo/client";
import {promote} from "event-matcher-shared";
import {useApp} from "../../hooks/useApp";

const EventView = () => {
  const {
    notif: { addNotice }
  } = useApp();
  const [showInvite, setShowInvite] = useState(false);
  const [invites, setInvites] = useState<IInviteMemberForm[]>([]);
  const navigate = useNavigate();
  const { id: _id } = useParams();
  const [consumePending, { loading:consuming}] = useMutation(gql`
    mutation ConsumePendingMembership($id: Float!, $eventId: Float!, $accept: Boolean!) {
      consumePendingMembership(id: $id, eventId: $eventId, accept: $accept) {
        success
        result
      }
    }
  `)

  if(!_id || isNaN(_id)) {
    navigate('/home');
  }
  
  const id = parseInt(_id!)
  const { data: GetEvent, loading: fetchingEvent } = useQuery<GetEvent>(GET_EVENT, {
    variables: { id }
  });
  const event = useMemo(() => GetEvent ? promote(GetEvent.event) : null, [GetEvent]);

  if(fetchingEvent) {
    return (
      <main className={'flex flex-col items-center'}>
        <h1 className={'mb-8'}>Loading ...</h1>

        <Cat />
      </main>
    )
  }

  if(event) {
    const onClickBack = () => navigate('/home');
    const onSubmitInvite = (invite: IInviteMemberForm) =>{
      setInvites((prev) => [...prev, invite])
      setShowInvite(false);
    };
    const onClickShareLink = async () => {
      await navigator.clipboard.writeText(`${window.origin}${event.joinLink}`);
      addNotice({
        id: 'event-copy-link',
        dismissable: true,
        message: 'Even join link copied to clipboard!',
        level: 'success',
        timeout: 10000
      });
    };
    const consumeMembership = async (pending: { id: number }, accept: boolean) => consumePending({
      variables: {
        accept,
        id: pending.id,
        eventId: event.id
      },
      refetchQueries: [
        { query: GET_EVENT, variables: { id } }
      ]
    });
    
    return (
      <main className={'w-full'}>
        <header
          className={'mb-2 cursor-pointer'}
          onClick={onClickBack}
        >
          <i className="fa-solid fa-chevron-left mr-3"></i>
          <span>Back</span>
        </header>

        <h1>
          { event.name }
        </h1>
  
        <div className={'mb-4 center'}>
          <a
            onClick={onClickShareLink}
            className={'cursor-pointer'}
            data-cy={'join-link'}
          >
            Share Links
            <i className="fa-solid fa-link ml-2" />
          </a>
        </div>

        <img
          alt={'Event Image'}
          className={'w-[250px] h-[200px] mb-5'}
          src={event.img}
        />

        <div className={'mb-5'}>
          { event.description }
        </div>
  
        { event.pendingMemberships.length > 0 && (
          <section className={'mb-3 max-w-xs'}>
            <div className={'mb-2'}>
              Pending Memberships
  
              { consuming &&
                <i className="fa-solid fa-yin-yang fa-spin ml-2" />
              }
            </div>
  
            {
              event.pendingMemberships.map((membership, index) =>
                <div className={'center mb-1.5'}>
                  <i
                    onClick={() => consumeMembership(membership, true)}
                    className="fa-regular fa-circle-check cursor-pointer text-submit mr-2 text-xl"
                    data-cy={`accept:pending:${index}`}
                  />
                  <i
                    onClick={() => consumeMembership(membership, false)}
                    className="fa-regular fa-circle-xmark cursor-pointer text-reject mr-4 text-xl"
                    data-cy={`reject:pending:${index}`}
                  />
                
                  {membership.displayName}
                </div>
              )
            }
          </section>
        )}
        
        <section className={"mb-5"}>
          <div
            className={'cursor-pointer'}
            onClick={() => setShowInvite(!showInvite)}
          >
            Users
    
            <i
              className="fa-solid fa-circle-plus ml-3 text-submit cursor-pointer"
              data-cy={'invite:create'}
            />
          </div>
  
          { showInvite && (
            <div className={'mt-3 max-w-xs'}>
              <InviteMember
                onSubmit={ onSubmitInvite }
                onCancel={ () => setShowInvite(false) }
              />
              <hr
                className={'my-5 mx-5'}
              />
            </div>
          )}
  
          { invites.length > 0 && (
            <section>
              Pending Invites { invites.length }
            </section>
          )}
        </section>
        
        <section className={'flex flex-wrap align-center justify-around'}>
          { event.memberships.map((member) => (
            <main key={member.email} className={'max-w-xs'}>
              <h2 className={'font-bold text-center text-md mb-5'}>{ member.displayName }</h2>
      
              <Calendar availabilities={member.availabilities} />
            </main>
          ))}
        </section>
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
