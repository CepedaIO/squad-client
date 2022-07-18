import {createContext, useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "./AuthProvider";
import {newDebug} from "../services/utils";

interface NavigationProviderProps {
  children: JSX.Element[] | JSX.Element
}

interface INavigationContext {
  guards: NavigationGuard[];
  navigate(to:string): void;
  navigateAnywhere(): void;
}

interface GuardApplies {
  authenticated: boolean;
  path: string;
}
interface GuardAction {
  navigate(to:string): void;
}
interface NavigationGuard {
  id: string;
  applies(params: GuardApplies): boolean;
  action(params: GuardAction): boolean | void;
}

export const NavigationContext = createContext<INavigationContext>({
  guards: [],
  navigate() { },
  navigateAnywhere() { }
});

const guards: NavigationGuard[] = [{
    id: 'Noop Paths',
    applies({ path }) {
      return [
        /^\/login$/,
        /^\/awaiting-access$/,
        /^\/login-with/,
      ].some((route) => route.test(path));
    },
    action() { return true; }
  }, {
    id: 'Fallthrough Protected Paths',
    applies({ authenticated}) {
      return !authenticated
    },
    action({ navigate }) { navigate('/login'); }
  }
]

const debug = newDebug('NavigationProvider');

const NavigationProvider = ({
  children
}: NavigationProviderProps) => {
  const { authenticated, loading } = useContext(AuthContext);
  const _navigate = useNavigate();

  useEffect(() => {
    if(!loading) {
      navigateWithGuards(location.pathname);
    }
  }, [loading, authenticated])

  const navigate = (to:string) => {
    navigateWithGuards(to);
  }

  const navigateWithGuards = (path:string) => {
    let shouldNavigate:boolean | void = true;
    const triggered = guards.find((guard) => guard.applies({ authenticated, path }));
    if(triggered) {
      debug(`${triggered.id} has been triggered`);
      shouldNavigate = triggered.action({ navigate: _navigate });
    }

    if(shouldNavigate) {
      _navigate(path);
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
