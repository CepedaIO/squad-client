import {createContext} from "react";
import authProvider, {IAuthContext} from "./authProvider";
import navigationProvider, {INavigationContext} from "./navigationProvider";
import errorProvider, {IErrorContext} from "./errorProvider";
import modalProvider, {IModalContext} from "./modalProvider";
import notificationProvider, {INotificationContext} from "./notificationProvider";

interface AppProviderProps {
  children?: JSX.Element[] | JSX.Element;
}

interface IAppContext {
  auth: IAuthContext;
  nav: INavigationContext;
  err: IErrorContext;
  modal: IModalContext<any>;
  notif: INotificationContext;
}

export const AppContext = createContext<IAppContext>({
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

const AppProvider = ({
  children
}: AppProviderProps) => {
  const auth = authProvider();
  const nav = navigationProvider(auth);
  const err = errorProvider();
  const {
    context: modal,
    view: modalView
  } = modalProvider();
  const {
    context: notif,
    view: notifView
  } = notificationProvider();

  return (
    <AppContext.Provider value={{
      nav,
      auth,
      err,
      modal,
      notif
    }}>
      { notifView }
      { modalView }
      { children }
    </AppContext.Provider>
  )
};

export default AppProvider;
