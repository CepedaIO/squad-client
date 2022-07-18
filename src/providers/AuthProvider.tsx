import {createContext, useState} from "react";
import {gql, useQuery} from "@apollo/client";

interface AuthProviderProps {
  children?: JSX.Element[] | JSX.Element;
}

interface IAuthContext {
  loading: boolean;
  authenticated: boolean;
  setAuthToken(token:string): void;
  pollForAuthentication(): void;
}

export const AuthContext = createContext<IAuthContext>({
  loading: false,
  authenticated: false,
  setAuthToken(){},
  pollForAuthentication(){},
});

const AuthProvider = ({
  children
}: AuthProviderProps) => {
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

  const setAuthToken = (token:string) => {
    localStorage.setItem('auth', token);
    setToken(token);
  }

  const pollForAuthentication = () => {
    if(authenticated) {
      return;
    }

    startPolling(3000)
  }

  return (
    <AuthContext.Provider value={{
      loading,
      authenticated,
      setAuthToken,
      pollForAuthentication
    }}>
      { children }
    </AuthContext.Provider>
  )
};

export default AuthProvider;
