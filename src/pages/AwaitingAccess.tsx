import {useContext, useEffect} from "react";
import {AuthContext} from "../providers/AuthProvider";
import {NavigationContext} from "../providers/NavigationProvider";

const AwaitingAccess = () => {
  const { authenticated, pollForAuthentication } = useContext(AuthContext);
  const { navigate } = useContext(NavigationContext);

  useEffect(() => {
    debugger;
    if(!authenticated) pollForAuthentication();
    if(authenticated) navigate('/home');
  }, [authenticated]);

  return (
    <div className="flex flex-col gap-12 items-center h-full">
      <h1 className="text-center">Awaiting Approval ... </h1>
      <p className="text-center" >
        Waiting for you to approve this login, have you checked your email?
        < br/>
        Return here after you've clicked the link!
      </p>

      <div className="mt-12">
        <img src="/cat.gif" />
      </div>
    </div>
  )
}

export default AwaitingAccess;
