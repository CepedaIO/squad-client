import {useParams, useSearchParams} from "react-router-dom";
import {useContext, useEffect, useRef} from "react";
import Button from "../../components/inline/Button";
import AppContext from "../../providers/AppContext";
import {useLoginToken} from "../../services/api/auth";
import Cat from "../../components/Cat";

const LoginWith = () => {
  const didAttemptLogin = useRef(false);
  const { key, uuid } = useParams();
  const [searchParams] = useSearchParams();
  const {
    auth: { authenticated, pollForAuthentication },
    nav: { navigate }
  } = useContext(AppContext);

  const variables = { key, uuid, expires: parseInt(searchParams.get('expires') || '0') };

  const [login, { error, data }] = useLoginToken();

  const failedLogin = error || data?.useLoginToken?.success === false;

  useEffect(() => {
    if(!didAttemptLogin.current) {
      login({ variables })
        .then(() => pollForAuthentication())
        .finally(() => didAttemptLogin.current = true);
    }
  }, []);

  return (
    <div className="flex flex-col gap-12 items-center h-full">
      <h1 className="text-center">Accepting Access ... </h1>

      { failedLogin &&
        <p className={"text-center cursor-pointer"} onClick={() => navigate('/login')}>
          <span className={"text-fatal"}>Oh No! </span>
          We were
          <span className={"text-fatal"}> unable </span>
          to log you in.. please <Button variant={"link"}>click here</Button> to try again
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
        <Cat />
      </div>
    </div>
  )
}

export default LoginWith;
