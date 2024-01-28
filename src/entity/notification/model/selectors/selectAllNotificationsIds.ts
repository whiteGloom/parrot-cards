import {useSelector} from 'react-redux';
import {notificationsAdapterSelectors} from '../notificationsSlice';
import {AppState} from '../../../../shared/lib/store/appState';

export const selectAllNotificationsIds = notificationsAdapterSelectors.selectIds as (state: AppState) => string[];

export function useSelectAllNotificationsIds() {
  return useSelector(selectAllNotificationsIds);
}
