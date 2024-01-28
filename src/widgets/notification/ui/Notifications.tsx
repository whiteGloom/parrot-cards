import React, {FC} from 'react';
import {useSelectAllNotificationsIds} from '../../../entity/notification';
import {Notification} from './Notification';

export const Notifications: FC = () => {
  const notificationsIds = useSelectAllNotificationsIds();

  return (
    <div className={'fixed flex flex-col items-end left-4 top-4 right-4 gap-2 md:left-auto md:w-[350px]'}>
      {notificationsIds.slice(0, 2).map(notificationsId => (
        <Notification key={notificationsId} notificationId={notificationsId}/>
      ))}
    </div>
  );
};
