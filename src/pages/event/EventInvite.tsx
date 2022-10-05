import {useNavigate, useParams} from "react-router-dom";
import MembershipEdit, {IMembershipForm} from "../../components/event/MembershipEdit";
import {Duration} from "luxon";
import FormContext, {createFormContext} from "../../providers/FormContext";
import React from "react";
import Button from "../../components/inline/Button";
import useForm from "../../hooks/useForm";
import {gql, useMutation, useQuery} from "@apollo/client";
import Cat from "../../components/Cat";
import {GET_EVENT_FROM_INVITE, GET_SUMMARIES, GetEventFromInvite} from "../../services/api/event";

const EventJoinContent = () => {
  const { validate } = useForm<IMembershipForm>();
  const { id, key, uuid } = useParams();
  const navigate = useNavigate();
  
  const {data, loading} = useQuery<GetEventFromInvite>(GET_EVENT_FROM_INVITE, {
    variables: { uuid, key }
  });
  
  const [acceptInviteMut, {}] = useMutation(gql`
    mutation AcceptInvite($payload: AcceptEventInput!) {
      acceptInvite(payload: $payload) {
        success
        result
      }
    }
  `, {
    refetchQueries: [
      {query: GET_SUMMARIES}
    ]
  })
  
  if(loading) {
    return <Cat />
  }
  
  const event = data?.eventFromInvite!;
  const duration = Duration.fromDurationLike(event.duration || {
    hours: 1
  });
  
  const onChange = (value:any) => console.log('changed', value);
  const onClickSubmit = () => {
    const [isValid, payload] = validate();
    if(isValid) {
      acceptInviteMut({
        variables: {
          payload: {
            ...payload,
            eventId: parseFloat(id!),
            uuid,
            key
          }
        }
      }).then(() => navigate(`/event/${id}`))
    }
  }
  
  const onClickBack = () => navigate('/home');
  
  return (
    <main className="h-full max-w-xs">
      <header
        className={'mb-4 cursor-pointer'}
        onClick={onClickBack}
      >
        <i className="fa-solid fa-chevron-left mr-3"></i>
        <span>Back</span>
      </header>

      <section className={'flex flex-col gap-5'}>
        <h1 className="text-center">Joining event ... </h1>
        <h2>{ event.name }</h2>
        <img
          alt={'Event Image'}
          src={event.img}
        />

        <MembershipEdit duration={duration} onChange={onChange} />
  
        <Button
          variant={"submit"}
          onClick={onClickSubmit}
          data-cy={'submit'}
          disabled={loading}
        >
          Submit
        </Button>
      </section>
    </main>
  )
};

const EventInvite = () => {
  const context = createFormContext<IMembershipForm>({
    displayName: '',
    availabilities: []
  });
  
  return (
    <FormContext.Provider value={ context }>
      <EventJoinContent  />
    </FormContext.Provider>
  )
}

export default EventInvite;
