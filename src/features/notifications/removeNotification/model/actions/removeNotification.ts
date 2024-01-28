import {useAppDispatch} from '../../../../../shared/lib/store/useAppDispatch';
import {removeNotification} from '../../../../../entity/notification/model/notificationsSlice';
import {useRef} from 'react';

export function useRemoveNotification() {
  const dispatch = useAppDispatch();

  return useRef((id: string) => dispatch(removeNotification({id}))).current;
}