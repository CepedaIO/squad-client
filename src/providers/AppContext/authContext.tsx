import {useState} from "react";
import {gql, useQuery} from "@apollo/client";

export interface IAuthContext {
  loading: boolean;
  authenticated: boolean;
  setAuthToken(token:string, isAuthenticated?: boolean): void;
  pollForAuthentication(): void;
}

const authContext = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [_, setToken] = useState<string | null>(null);

  const { loading, startPolling, stopPolling }= useQuery(gql`
    query Authenticated {
      authenticated {
        success
      }
    }
  `, {
    onCompleted(data) {
      if(data?.authenticated) {
        setAuthenticated(data?.authenticated?.success);
        stopPolling()
      }
    }
  });

  const setAuthToken = (token:string, isAuthenticated: boolean = false) => {
    localStorage.setItem('auth', token);
    setToken(token);
    setAuthenticated(isAuthenticated);
  }

  const pollForAuthentication = () => {
    if(authenticated) {
      return;
    }

    startPolling(3000)
  }

  return {
    loading,
    authenticated,
    setAuthToken,
    pollForAuthentication
  };
};

export default authContext;
