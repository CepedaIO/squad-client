import {useContext} from "react";
import {INotificationContext, NotificationContext} from "../providers/NotificationProvider";
import $c from "classnames";

const NotificationBanner = () => {
  const { notices } = useContext(NotificationContext) as INotificationContext;
  const whiteText = ['error', 'fatal'];

  return (
    <main>
      {notices.map((notice) =>
        <div className={$c(`py-3 px-7 bg-${notice.level} text-center`, {
          'text-white': whiteText.includes(notice.level)
        })} key={notice.id}>
          {notice!.message}
        </div>
      )}
    </main>
  )
}

export default NotificationBanner;
