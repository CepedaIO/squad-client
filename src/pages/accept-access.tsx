import {useParams} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {useEffect} from "react";

const AcceptAccess = () => {
  const { token, uuid } = useParams();

  const [sendToken, { data }] = useMutation(gql`
    mutation UseLoginToken($token: String!, $uuid: String!) {
      useLoginToken(token: $token, uuid: $uuid) {
        success
      }
    }
  `, {
    variables: { token, uuid }
  })

  useEffect(() => {
    sendToken()
  }, []);

  useEffect(() => {
    if(data?.useLoginToken?.success) {
      window.close();
    }
  })

  return (
    <>
      <h1>Accepting access!</h1>
      <h2>Token: {token}</h2>
      <h2>UUID: {uuid}</h2>
    </>
  )
}

export default AcceptAccess;
