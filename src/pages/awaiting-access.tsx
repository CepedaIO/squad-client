import {gql, useQuery} from "@apollo/client";
import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

const AwaitingAccess = () => {
  const navigate = useNavigate();
  const { data, startPolling } = useQuery(gql`
    query Authenticated {
      authenticated {
        success
      }
    }
  `);

  useEffect(() => {
    startPolling(5000)
  }, []);

  useEffect(() => {
    if(data?.authenticated.success) {
      navigate('/home');
    }
  }, [data])

  return (
    <div className="flex flex-col gap-16 items-center h-full">
      <h1 className="text-center">Awaiting Approval ... </h1>
      <p className="text-center" >
        Waiting for you to approve this login, have you checked your email?
        < br/>
        Return here after you've clicked the link!
      </p>

      <div className="mt-20">
        <img src="/cat.gif" />
      </div>
    </div>
  )
}

export default AwaitingAccess;
