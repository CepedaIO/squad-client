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
import {GET_SUMMARIES} from "../../services/api/event";

const EventJoinContent = () => {
  const { validate } = useForm<IMembershipForm>();
  const { id, key, uuid } = useParams();
  const navigate = useNavigate();
  
  const {data, loading} = useQuery(gql`
    query GetEventSummaryForInvite($uuid: String!, $key: String!) {
      getEventSummaryForInvite(uuid: $uuid, key: $key){
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
  
  const summary = data.getEventSummaryForInvite as IEventSummary;
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
      <img
        alt={'Event Image'}
        src={summary.img}
      />
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
