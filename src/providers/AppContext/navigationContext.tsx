import {useEffect} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {newDebug} from "../../services/utils";
import {IAuthContext} from "./authContext";

export interface INavigationContext {
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

const navigationContext = ({ authenticated, loading }: IAuthContext) => {
  const { pathname: currentPath } = useLocation();
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
      debug(`${triggered.id} has been triggered for: ${path}`);
      shouldNavigate = triggered.action({ navigate });
    }

    if(shouldNavigate && currentPath !== path) {
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

  return {
    guards,
    navigate,
    navigateAnywhere
  };
}

export default navigationContext;
