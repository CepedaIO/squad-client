import React, {FC, useContext} from "react";
import {AppNotice, INotificationContext, NotificationContext} from "../App";

const AppErrorBanner = () => {
  const { notices } = useContext(NotificationContext) as INotificationContext;

  const bannerMap = new Map([
    ['warning', (notice: AppNotice) =>
      (<div className="py-3 px-7 bg-warning" key={notice.id}>
        Warning!
        {notice!.message}
      </div>)
    ], ['info', (notice: AppNotice) =>
      (<div className="py-3 px-7 bg-info" key={notice.id}>
        Warning!
        {notice!.message}
      </div>)
    ], ['error', (notice: AppNotice) =>
      (<div className="py-3 px-7 bg-error" key={notice.id}>
        Warning!
        {notice!.message}
      </div>)
    ], ['success', (notice: AppNotice) =>
      (<div className="py-3 px-7 bg-success" key={notice.id}>
        Warning!
        {notice!.message}
      </div>)
    ]
  ])

  const NoticeDivs = notices.map((notice) =>
    bannerMap.get(notice.level)!(notice)
  );

  return (
    <main>
      { NoticeDivs }
    </main>
  )
}

export default AppErrorBanner;
