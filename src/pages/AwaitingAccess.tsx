import {useContext, useEffect} from "react";
import {AppContext} from "../providers/AppProvider";

const AwaitingAccess = () => {
  const {
    auth: { authenticated, pollForAuthentication },
    nav: { navigate }
  } = useContext(AppContext);

  useEffect(() => {
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
        <img src="/cat.gif"  alt={"cat"}/>
      </div>
    </div>
  )
}

export default AwaitingAccess;
