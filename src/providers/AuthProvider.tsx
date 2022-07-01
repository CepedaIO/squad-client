import {createContext, useEffect, useState} from "react";
import {gql, useLazyQuery, useQuery} from "@apollo/client";

interface AuthProviderProps {
  children: JSX.Element[] | JSX.Element;
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

  const { data, loading, startPolling, stopPolling }= useQuery(gql`
    query Authenticated {
      authenticated {
        success
      }
    }
  `, {
    onCompleted(data) {
      if(data?.authenticated?.success === true) {
        setAuthenticated(true);
        stopPolling();
      }
    }
  });

  const setAuthToken = (token:string) => {
    localStorage.setItem('auth', token);
    setToken(token);
  }

  return (
    <AuthContext.Provider value={{
      loading,
      authenticated,
      setAuthToken,
      pollForAuthentication: () => startPolling(5000)
    }}>
      { children }
    </AuthContext.Provider>
  )
};

export default AuthProvider;
