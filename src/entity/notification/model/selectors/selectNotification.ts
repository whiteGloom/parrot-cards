import {notificationsAdapterSelectors} from '../notificationsSlice';
import {useSelector} from 'react-redux';
import {AppState} from '../../../../shared/lib/store/appState';

export const selectNotification = notificationsAdapterSelectors.selectById;

export function useSelectNotification(id: string) {
  return useSelector((state: AppState) => selectNotification(state, id));
}