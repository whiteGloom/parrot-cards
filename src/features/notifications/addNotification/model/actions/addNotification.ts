import {useAppDispatch} from '../../../../../shared/lib/store/useAppDispatch';
import {addNotification} from '../../../../../entity/notification/model/notificationsSlice';
import {useRef} from 'react';
import {createAsyncThunk} from '@reduxjs/toolkit';
import {INotification, NotificationType} from '../../../../../entity/notification';
import {AppState} from '../../../../../shared/lib/store/appState';
import {UniqueIdGenerator} from '../../../../../shared/lib/UniqueIdGenerator/UniqueIdGenerator';

type AddNotificationParamsType= {
  title: string;
  type: NotificationType;
  id?: string;
  lifetime?: number;
  description?: string;
  buttons: {
    text: string;
    action: string;
    icon?: string;
  }[]
}

export const addNotificationThunk = createAsyncThunk<INotification | undefined, AddNotificationParamsType, {state: AppState}>(
  'addNotification',
  function (data, thunkAPI) {
    const id = data.id || UniqueIdGenerator.generateSimpleUniqueId();

    thunkAPI.dispatch(addNotification({
      id,
      title: data.title,
      description: data.description || '',
      lifetime: data.lifetime || 5000,
      createdAt: Date.now(),
      buttons: [],
      type: data.type,
      isUnderInteraction: false,
      lastInteractionAt: Date.now(),
    }));

    return thunkAPI.getState().notifications.entities[id];
  }
);

export function useAddNotificationThunk() {
  const dispatch = useAppDispatch();

  return useRef((data: AddNotificationParamsType) => dispatch(addNotificationThunk(data))).current;
}