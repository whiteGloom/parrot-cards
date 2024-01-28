export {notificationsSliceReducer} from './model/notificationsSlice';

export {selectNotification, useSelectNotification} from './model/selectors/selectNotification';
export {selectAllNotifications, useSelectAllNotifications} from './model/selectors/selectAllNotifications';
export {selectAllNotificationsIds, useSelectAllNotificationsIds} from './model/selectors/selectAllNotificationsIds';

export type {INotification} from './types/notification';
export {NotificationType} from './types/notification';