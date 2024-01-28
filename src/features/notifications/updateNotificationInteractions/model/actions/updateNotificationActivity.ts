import {useAppDispatch} from '../../../../../shared/lib/store/useAppDispatch';
import {updateNotificationInteractions} from '../../../../../entity/notification/model/notificationsSlice';

export function useUpdateNotificationInteractions() {
  const dispatch = useAppDispatch();

  return (data: {id: string, isUnderInteraction: boolean}) => dispatch(updateNotificationInteractions(data));
}