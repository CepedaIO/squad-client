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
import {AVAILABILITIES_FOR_EVENT, AvailabilitiesForEvent} from "../../services/api/availability";
import {DateTime} from "luxon";
import EventAvailabilityChooser from "../../components/availability/EventTimeChooser";
import $c from "classnames";

const EventView = () => {
  const {
    notif: { addNotice }
  } = useApp();
  const [showInvite, setShowInvite] = useState(false);
  const [showPending, setShowPending] = useState(true);
  const [currentMonth, setCurrentMonth] = useState<number>(DateTime.now().month);
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
  
  const id = parseInt(_id!);
  const { data: GetEvent, loading: fetchingEvent, refetch } = useQuery<GetEvent>(GET_EVENT, {
    variables: { id },
  });
  
  const { data: GetEventAvailabilities } = useQuery<AvailabilitiesForEvent>(AVAILABILITIES_FOR_EVENT, {
    variables: {
      eventId: id,
      start: DateTime.fromObject({ month: currentMonth }).startOf('month'),
      end: DateTime.fromObject({ month: currentMonth }).endOf('month')
    }
  });
  const event = useMemo(() => promote(GetEvent?.event!), [GetEvent])
  const eventAvailabilities = useMemo(() => promote(GetEventAvailabilities?.availabilityForEvent || []), [GetEventAvailabilities]);

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
        message: 'Join link copied to clipboard!',
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
        { query: GET_EVENT, variables: { id } },
        {
          query: AVAILABILITIES_FOR_EVENT,
          variables: {
            eventId: id,
            start: DateTime.fromObject({ month: currentMonth }).startOf('month'),
            end: DateTime.fromObject({ month: currentMonth }).endOf('month')
          }
        }
      ]
    });
    
    const resolved = !!event.resolution;
    const eventTimes = resolved ? [event.resolution!] : eventAvailabilities;

    return (
      <main className={'w-full'}>
        <header
          className={'mb-2 cursor-pointer'}
          onClick={onClickBack}
        >
          <i className="fa-solid fa-chevron-left mr-3"></i>
          <span>Back</span>
        </header>

        <section className={'center flex-wrap justify-around mb-5'}>
          <div>
            <h1 className={$c({
              'mb-3': resolved
            })}>
              { event.name }
            </h1>
  
            { !resolved &&
              <div className={'mb-4 mt-1.5 center'}>
                <a
                  onClick={onClickShareLink}
                  className={'cursor-pointer'}
                  data-cy={'join-link'}
                >
                  Join Link
                  <i className="fa-solid fa-link ml-2" />
                </a>
              </div>
            }
  
            <img
              alt={'Event Image'}
              className={'w-[250px] h-[200px] mb-5'}
              src={event.img}
            />
          </div>
          
  
          <div className={'mb-5 max-w-md'}>
            { event.description }
          </div>
        </section>
        
        <section className={'center justify-around'}>
          <Calendar
            className={'max-w-xs'}
            availabilities={eventTimes}
            month={currentMonth}
            shouldChange={setCurrentMonth}
            variant={event.resolution ? 'resolved' : undefined}
          />
  
          { !resolved &&
            <EventAvailabilityChooser
              eventId={event.id}
              availabilities={eventAvailabilities}
              onSubmit={refetch}
              isAdmin={event.user.permissions.isAdmin}
            />
          }
  
          { resolved &&
            <section className={'p-3 min-w-[320px] min-h-[300px] flex flex-col'}>
              <h2 className={'mb-5 text-error'}>Event Time!</h2>
              
              <div>
                <div className={'mb-5'}>
                  <span className={'font-bold'}>Start</span>
                  <br/>
                  <span className={'text-submit'}>{ event.resolution!.start.toLocaleString(DateTime.DATETIME_FULL) }</span>
                </div>
                <div>
                  <span className={'font-bold'}>End</span>
                  <br/>
                  <span className={'text-submit'}>{ event.resolution!.end.toLocaleString(DateTime.DATETIME_FULL) }</span>
                </div>
              </div>
              
              <footer className={'mt-14 font-bold'}>
                Thank you for using squad!
              </footer>
            </section>
          }
          
        </section>

        { event.pendingMemberships.length > 0 && (
          <section className={'mb-3 max-w-xs mt-8 ml-10'}>
            <div className={'mb-2 cursor-pointer'} onClick={() => setShowPending(!showPending)}>
              Pending Memberships
              <span className={'font-bold'}> { event.pendingMemberships.length }</span>
  
              { consuming &&
                <i className="fa-solid fa-yin-yang fa-spin ml-2" />
              }
            </div>
  
            { showPending && event.pendingMemberships.map((membership, index) =>
                <div className={'center mb-1.5'} key={membership.id}>
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
  
        { !resolved && <>
          <section className={"mb-5 mt-8 ml-10"}>
            <div
              className={'cursor-pointer'}
              onClick={() => setShowInvite(!showInvite)}
            >
              <span className={'text-2xl'}>
                Users
              </span>
  
              <i
                className="fa-solid fa-circle-plus ml-3 text-submit cursor-pointer text-xl"
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
          
          <section className={'flex flex-wrap align-center justify-around gap-5'}>
            { event.memberships.map((member) => (
              <main key={member.email} className={'max-w-xs'}>
                <h2 className={'font-bold text-center text-md mb-5'}>{ member.displayName }</h2>
        
                <Calendar
                  availabilities={member.availabilities}
                  month={currentMonth}
                />
              </main>
            ))}
          </section>
        </>}
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
