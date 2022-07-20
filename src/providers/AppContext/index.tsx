import {createContext} from "react";
import authContext, {IAuthContext} from "./authContext";
import navigationContext, {INavigationContext} from "./navigationContext";
import errorContext, {IErrorContext} from "./errorContext";
import modalContext, {IModalContext} from "./modalContext";
import notificationContext, {INotificationContext} from "./notificationContext";
import pageContext, {IPageContext} from "./pageContext";

interface IAppContext {
  auth: IAuthContext;
  nav: INavigationContext;
  err: IErrorContext;
  modal: IModalContext<any>;
  notif: INotificationContext;
  page: IPageContext;
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
  },
  page: {
    values: {},
    results: {},
    onChange: () => {},
    addValidators: () => {},
    validate: () => {}
  }
});
AppContext.displayName = 'App';

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
  const page = pageContext(err);
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
      auth, err, nav, modal, notif, page
    },
    views: {
      notif: notifView,
      modal: modalView
    }
  };
};

export default AppContext;
