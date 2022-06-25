import {useContext} from "react";
import {INotificationContext, NotificationContext} from "../providers/NotificationProvider";

const NotificationBanner = () => {
  const { notices } = useContext(NotificationContext) as INotificationContext;

  return (
    <main>
      {notices.map((notice) =>
        <div className={`py-3 px-7 bg-${notice.level}`} key={notice.id}>
          {notice!.message}
        </div>
      )}
    </main>
  )
}

export default NotificationBanner;
