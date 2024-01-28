import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {updateNotificationActivity} from '../notificationsSlice';

export function useUpdateNotificationActivity() {
  const dispatch = useAppDispatch();

  return (data: {id: string, isUnderInteraction: boolean}) => dispatch(updateNotificationActivity(data));
}