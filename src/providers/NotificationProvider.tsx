import {createContext, useCallback, useState} from "react";

export interface AppNotice {
  id: string;
  message: string;
  level: 'warning' | 'info' | 'error' | 'fatal' | 'success' | 'reject' | 'resolve'
}

export interface INotificationContext {
  notices: AppNotice[],
  addNotice(notice: AppNotice): void;
  removeNotice(id: string): void;
  handleUnexpected(err?: any): void;
}

export const NotificationContext = createContext<INotificationContext>({} as INotificationContext);

interface NotificationContextProviderProps {
  children: JSX.Element
}
const NotificationProvider = ({
  children
}: NotificationContextProviderProps) => {
  const [notices, setNotices] = useState<AppNotice[]>([]);
  const addNotice = useCallback((notice: AppNotice) =>
    setNotices((prev) =>
      prev.filter((n) => n.id !== notice.id)
        .concat(notice)
    )
  , [setNotices]);

  const removeNotice = useCallback((id: string) =>
    setNotices((prev) => prev.filter((n) => n.id !== id))
  , [setNotices]);

  const handleUnexpected = useCallback((err?: any) => {
    if(err) {
      addNotice({
        id: 'UnexpectedError',
        message: 'Encountered an unexpected error! Please try again or contact me at alfred@cepeda.io',
        level: 'fatal'
      })
    } else {
      removeNotice('UnexpectedError')
    }
  }, [addNotice, removeNotice]);

  return (
    <NotificationContext.Provider value={{
      notices,
      addNotice,
      removeNotice,
      handleUnexpected
    }}>
      { children }
    </NotificationContext.Provider>
  )
}

export default NotificationProvider;
