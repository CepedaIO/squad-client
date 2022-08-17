import {useParams, useSearchParams} from "react-router-dom";
import {gql, useMutation} from "@apollo/client";
import {useContext, useEffect, useRef} from "react";
import Button from "../components/inline/Button";
import AppContext from "../providers/AppContext";

const LoginWith = () => {
  const didAttemptLogin = useRef(false);
  const { token, uuid } = useParams();
  const [searchParams] = useSearchParams();
  const {
    auth: { authenticated, pollForAuthentication },
    nav: { navigate }
  } = useContext(AppContext);

  const variables = { token, uuid, expires: parseInt(searchParams.get('expires') || '0') };

  const [login, { error, data }] = useMutation(gql`
    mutation UseLoginToken($token: String!, $uuid: String!, $expires: Int!) {
      useLoginToken(token: $token, uuid: $uuid, expires: $expires) {
        success
      }
    }
  `, {
    variables
  });

  const failedLogin = error || data?.useLoginToken?.success === false;

  useEffect(() => {
    if(!didAttemptLogin.current) {
      login();
      pollForAuthentication();
      didAttemptLogin.current = true;
    }
  }, []);

  return (
    <div className="flex flex-col gap-12 items-center h-full">
      <h1 className="text-center">Accepting Access ... </h1>

      { failedLogin &&
        <p className={"text-center"}>
          <span className={"text-fatal"}>Oh No! </span>
          We were
          <span className={"text-fatal"}> unable </span>
          to log you in please <Button variant={"link"} onClick={() => navigate('/login')}> Click Here</Button> to try again
        </p>
      }

      { !failedLogin && !authenticated && (
        <p className="text-center" >
          Logging you in, this will only take a moment
        </p>
      )}

      { !failedLogin && authenticated && (
        <p className="text-center" >
          You're logged in! Either close this window and go back to the one you logged in on
          < br/>
          <span className="font-bold">OR</span>
          < br/>
          <Button
            variant="link"
            onClick={() => navigate("/home")}
            data-cy={'navigate:home'}>Click Here to go the homepage</Button>
        </p>
      )}

      <div className="mt-12">
        <img src="/cat.gif"  alt="Swaying Cat"/>
      </div>
    </div>
  )
}

export default LoginWith;
