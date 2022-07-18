import {createContext} from "react";
import authContext, {IAuthContext} from "./authContext";
import navigationContext, {INavigationContext} from "./navigationContext";
import errorContext, {IErrorContext} from "./errorContext";
import modalContext, {IModalContext} from "./modalContext";
import notificationContext, {INotificationContext} from "./notificationContext";

interface IAppContext {
  auth: IAuthContext;
  nav: INavigationContext;
  err: IErrorContext;
  modal: IModalContext<any>;
  notif: INotificationContext;
}

const AppContext = createContext<IAppContext>({
  nav: {
    guards: [],
    navigate:() => {},
    navigateAnywhere:() => {}
  },
  auth: {
    loading: true,
    authenticated: false,
    setAuthToken:() => {},
    pollForAuthentication:() => {},
  },
  err: {
    errors: [],
    addErrors: () => {},
    hasError: () => false,
    removeErrors: () => {},
    getError: () => undefined,
  },
  modal: {
    result: null,
    showing: null,
    show: () => {},
    resolve: () => {}
  },
  notif: {
    addNotice: () => {},
    handleUnexpected: () => {},
    notices: [],
    removeNotice: () => {}
  }
});
AppContext.displayName = 'AppContext';

export const createAppContext = (): {
  context: IAppContext,
  views: {
    notif: JSX.Element,
    modal: JSX.Element | null
  }
} => {
  const auth = authContext();
  const nav = navigationContext(auth);
  const err = errorContext();
  const {
    context: modal,
    view: modalView
  } = modalContext();
  const {
    context: notif,
    view: notifView
  } = notificationContext();

  return {
    context: {
      auth, err, nav, modal, notif
    },
    views: {
      notif: notifView,
      modal: modalView
    }
  };
};

export default AppContext;
