import {useApp} from "../hooks/useApp";
import Button from "../components/inline/Button";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect} from "react";
import {gql, useMutation, useQuery} from "@apollo/client";
import {
  GET_EVENT_FROM_JOIN,
  GetEventFromJoinLink
} from "../services/api/event";
import Cat from "../components/Cat";
import {Duration} from "luxon";
import MembershipEdit, {IMembershipForm} from "../components/event/MembershipEdit";
import useForm from "../hooks/useForm";
import FormContext, {createFormContext} from "../providers/FormContext";

const JoinContent = () => {
  const {
    notif: { addNotice },
    auth: { authenticated }
  } = useApp();
  const { validate } = useForm<IMembershipForm>();
  const { key } = useParams();
  const navigate = useNavigate();
  const [createRequest, { loading, data }] = useMutation(gql`
    mutation CreateJoinRequest($payload: RequestJoinInput!) {
      createJoinRequest(payload: $payload) {
        result
        success
      }
    }
  `)
  
  useEffect(() => {
    if(!authenticated) {
      addNotice({
        id: 'must-login',
        level: 'error',
        message: 'You must login before joining that event',
        dismissable: true,
        timeout: 10000
      });
      navigate('/login');
    }
  }, [authenticated]);
  
  const {data: getJoinLinkData, loading: loadingEvent} = useQuery<GetEventFromJoinLink>(GET_EVENT_FROM_JOIN, {
    variables: { key }
  });
  
  if(loadingEvent) {
    return <Cat />
  }
  
  const joinLink = getJoinLinkData?.joinLink;
  if(!joinLink) {
    return (
      <main>
        What the cat?
      </main>
    )
  }
  
  const event = joinLink.event;
  const duration = Duration.fromDurationLike(event.duration || {
    hours: 1
  });
  
  const onChange = (value:any) => console.log('changed', value);
  const onClickSubmit = async () => {
    const [isValid, payload] = validate();
    if(isValid) {
      await createRequest({
        variables: {
          payload: {
            ...payload,
            key,
            eventId: event.id
          }
        }
      });
  
      addNotice({
        id: 'request-created',
        level: 'success',
        message: `You have requested to join: ${event.name}`,
        dismissable: true,
        timeout: 10000
      });
      navigate('/home');
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
        <h1>{ event.name }</h1>
        <p>{ event.description }</p>
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
}

const Join = () => {
  const context = createFormContext<IMembershipForm>({
    displayName: '',
    availabilities: []
  });
  
  return (
    <FormContext.Provider value={ context }>
      <JoinContent  />
    </FormContext.Provider>
  )
}
export default Join;
