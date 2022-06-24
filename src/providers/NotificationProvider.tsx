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
  , [notices]);

  const removeNotice = useCallback((id: string) =>
    setNotices((prev) => prev.filter((n) => n.id !== id))
  , [notices]);

  return (
    <NotificationContext.Provider value={{
      notices,
      addNotice,
      removeNotice
    }}>
      { children }
    </NotificationContext.Provider>
  )
}

export default NotificationProvider;
