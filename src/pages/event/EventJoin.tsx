import {useNavigate, useParams} from "react-router-dom";
import MembershipEdit, {IMembershipForm} from "../../components/event/MembershipEdit";
import {Duration} from "luxon";
import FormContext, {createFormContext} from "../../providers/FormContext";
import React from "react";
import Button from "../../components/inline/Button";
import useForm from "../../hooks/useForm";
import {gql, useMutation, useQuery} from "@apollo/client";
import Cat from "../../components/Cat";
import {IEventSummary} from "event-matcher-shared";

type EventJoinForm = IMembershipForm;

const EventJoinContent = () => {
  const { validate } = useForm<IMembershipForm>();
  const { id, key, uuid } = useParams();
  const navigate = useNavigate();
  
  const {data, loading} = useQuery(gql`
    query GetEventSummaryFor($id: Float!) {
      getEventSummaryFor(id: $id){
        id
        img
        name
        duration {
          hours
          days
          minutes
        }
      }
    }
  `, {
    variables: { id: parseInt(id!) }
  });
  
  const [acceptInviteMut, {}] = useMutation(gql`
    mutation AcceptInvite($payload: AcceptInviteInput!) {
      acceptInvite(payload: $payload) {
        success
        result
      }
    }
  `)
  
  if(loading) {
    return <Cat />
  }
  
  const summary = data?.getEventSummaryFor as IEventSummary;
  
  const duration = Duration.fromDurationLike(summary.duration || {
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
  
  return (
    <main className="flex flex-col gap-5 items-center h-full max-w-xs">
      <h1 className="text-center">Joining event ... </h1>
      <h2>{ summary.name }</h2>
      <img src={summary.img} />
      <MembershipEdit duration={duration} onChange={onChange} />
      <footer className={"center"}>
        <Button
          className={"mr-5"}
          variant={"reject"}
          onClick={onClickSubmit}
          data-cy={'reject'}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <Button
          variant={"submit"}
          onClick={onClickSubmit}
          data-cy={'submit'}
          disabled={loading}
        >
          Submit
        </Button>
      </footer>
    </main>
  )
};

const EventJoin = () => {
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

export default EventJoin;
