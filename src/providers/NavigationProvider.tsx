import {createContext, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthProvider";

interface NavigationProviderProps {
  children: JSX.Element[] | JSX.Element
}

type NavigationGuard = {
  id: string;
  applies(path: string): boolean;
  action(): void;
}

interface INavigationContext {
  guards: NavigationGuard[];
  navigate(to:string): void;
  navigateAnywhere(): void;
}

export const NavigationContext = createContext<INavigationContext>({
  guards: [],
  navigate() { },
  navigateAnywhere() { }
});

const isUnprotectedPath = (path:string): boolean => [
  '/login',
  '/awaiting-access',
  '/accepting-access'
].some((route) => path.startsWith(route));

const NavigationProvider = ({
  children
}: NavigationProviderProps) => {
  const { authenticated, loading } = useContext(AuthContext);
  const _navigate = useNavigate();

  useEffect(() => {
    if(!loading) {
      verifyGuards(location.pathname);
    }
  }, [loading, authenticated])
  const guards = [
    {
      id: 'Already logged in',
      applies: (path:string) => authenticated && isUnprotectedPath(path),
      action: () => _navigate('/home')
    }, {
      id: 'Must be logged in',
      applies: (path:string) => !authenticated && !isUnprotectedPath(path),
      action: () => _navigate('/login')
    }
  ];

  const navigate = (to:string) => {
    verifyGuards(to);
  }

  const verifyGuards = (to:string) => {
    const triggered = guards.find((guard) => guard.applies(to));
    if(triggered) {
      triggered.action();
    } else {
      _navigate(to);
    }
  };

  const navigateAnywhere = () => {
    if(authenticated) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }

  return (
    <NavigationContext.Provider value={{
      guards,
      navigate,
      navigateAnywhere
    }}>
      { children }
    </NavigationContext.Provider>
  )
}

export default NavigationProvider;
