import React, {FC, useEffect} from 'react';
import {useSelectNotification, NotificationType} from '../../../entity/notification';
import {useRemoveNotification} from '../../../features/notifications/removeNotification';
import clsx from 'clsx';
import {X} from 'lucide-react';
import {useUpdateNotificationInteractions} from '../../../features/notifications/updateNotificationInteractions';

export type NotificationPropsType = {
  notificationId: string;
}

export const Notification: FC<NotificationPropsType> = (props) => {
  const notification = useSelectNotification(props.notificationId);
  const dispatchNotificationUpdate = useUpdateNotificationInteractions();
  const dispatchRemoveNotification = useRemoveNotification();

  const lifeTime = notification?.lifetime || Infinity;
  const isUnderInteraction = notification?.isUnderInteraction || false;
  const lastInteraction = notification?.lastInteractionAt;

  useEffect(() => {
    if (!isFinite(lifeTime) || isUnderInteraction) return;

    const timeoutId = setTimeout(() => {
      dispatchRemoveNotification(props.notificationId);
    }, lifeTime);

    return () => clearTimeout(timeoutId);
  }, [dispatchRemoveNotification, isUnderInteraction, lifeTime, props.notificationId, lastInteraction]);

  if (!notification) {
    return null;
  }

  return (
    <div
      className={clsx([
        'flex flex-col border border-gray-400 border-t-4 rounded shadow-xl overflow-hidden p-2.5 gap-1 bg-white w-full transition-opacity',
        notification.type === NotificationType.Success && 'border-t-green-500 md:only-fine:opacity-50 md:hover:only-fine:opacity-100',
        notification.type === NotificationType.Error && 'border-t-rose-500',
      ])}
      onMouseEnter={() => {
        dispatchNotificationUpdate({id: props.notificationId, isUnderInteraction: true});
      }}
      onMouseLeave={() => {
        dispatchNotificationUpdate({id: props.notificationId, isUnderInteraction: false});
      }}
      onClick={() => {
        dispatchNotificationUpdate({id: props.notificationId, isUnderInteraction: notification.isUnderInteraction});
      }}
    >
      <div className={'flex items-center gap-1 justify-between'}>
        <p className={'font-semibold'}>{notification.title}</p>

        <button
          className={'border shadow p-1 bg-white rounded float-right hover:bg-gray-100 active:bg-gray-200'}
          onClick={() => {
            dispatchRemoveNotification(props.notificationId);
          }}
        ><X size={15}/></button>
      </div>

      {!!notification.description && <p>{notification.description}</p>}
    </div>
  );
};