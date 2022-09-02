import {useCallback, useState} from "react";
import $c from "classnames";

export interface AppNotice {
  id: string;
  message: string;
  level: 'warning' | 'info' | 'error' | 'fatal' | 'success' | 'reject' | 'resolve',
  dismissable?: boolean;
  timeout?: number;
}

export interface INotificationContext {
  notices: AppNotice[],
  addNotice(notice: AppNotice): void;
  removeNotice(id: string): void;
  handleUnexpected(err?: any): void;
}

const whiteText = ['error', 'fatal'];

const notificationContext = () => {
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
        message: 'Encountered an unexpected error! Please try again or contact me at support@cepeda.io',
        level: 'fatal'
      })
    } else {
      removeNotice('UnexpectedError')
    }
  }, [addNotice, removeNotice]);

  const onClickNotice = (notice: AppNotice) => {
    if(notice.dismissable) {
      removeNotice(notice.id);
    }
  };

  return {
    context: {
      notices,
      addNotice,
      removeNotice,
      handleUnexpected
    },
    view: (
      <main>
        {notices.map((notice) =>
          <div
            className={$c(`py-3 px-7 bg-${notice.level} text-center align-center`, {
              'text-white': whiteText.includes(notice.level),
              'cursor-pointer': notice.dismissable
            })}
            key={notice.id}
            onClick={() => onClickNotice(notice)}
          >
            {notice.dismissable &&
              <i className="fa-regular fa-circle-xmark float-left pt-1 text-hint" />
            }
            {notice!.message}
          </div>
        )}
      </main>
    )
  };
}

export default notificationContext;
