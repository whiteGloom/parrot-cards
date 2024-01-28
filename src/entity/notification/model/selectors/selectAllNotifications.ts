import {useSelector} from 'react-redux';
import {notificationsAdapterSelectors} from '../notificationsSlice';

export const selectAllNotifications = notificationsAdapterSelectors.selectAll;

export function useSelectAllNotifications() {
  return useSelector(selectAllNotifications);
}
