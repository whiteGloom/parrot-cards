import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {INotification, NotificationType} from '../types/notification';
import {AppState} from '../../../shared/lib/store/appState';

const notificationsEntityAdapter = createEntityAdapter<INotification>({
  selectId: (notification) => notification.id,
  sortComparer: (notificationA, notificationB) => notificationA.createdAt - notificationB.createdAt,
});

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsEntityAdapter.getInitialState({
    ids: [1, 2, 3, 4],
    entities: {
      1: {
        id: '1',
        title: 'Card deleted successfully',
        createdAt: Date.now(),
        lastInteractionAt: Date.now(),
        buttons: [],
        type: NotificationType.Success,
        lifetime: 5000,
        isUnderInteraction: false,
      },
      2: {
        id: '2',
        title: 'Card delete error!',
        createdAt: Date.now(),
        lastInteractionAt: Date.now(),
        buttons: [],
        type: NotificationType.Error,
        description: 'Uncaught TypeError: can\'t access property "f" of undefined',
        lifetime: 5000,
        isUnderInteraction: false,
      },
      3: {
        id: '3',
        title: '3',
        createdAt: Date.now(),
        lastInteractionAt: Date.now(),
        buttons: [],
        type: NotificationType.Error,
        description: 'Uncaught TypeError: can\'t access property "f" of undefined',
        lifetime: 5000,
        isUnderInteraction: false,
      },
      4: {
        id: '4',
        title: '4',
        createdAt: Date.now(),
        lastInteractionAt: Date.now(),
        buttons: [],
        type: NotificationType.Error,
        description: 'Uncaught TypeError: can\'t access property "f" of undefined',
        lifetime: 5000,
        isUnderInteraction: false,
      },
    },
  }),
  reducers: {
    updateNotificationActivity(state, action: PayloadAction<{id: string, isUnderInteraction: boolean}>) {
      const notification = state.entities[action.payload.id];

      if (!notification) return;

      notification.isUnderInteraction = action.payload.isUnderInteraction;
      notification.lastInteractionAt = Date.now();
    },
    removeNotification(state, action: PayloadAction<{id: string}>) {
      notificationsEntityAdapter.removeOne(state, action.payload.id);
    },
  },
});

export const notificationsSliceReducer = notificationsSlice.reducer;

export const notificationsAdapterSelectors = notificationsEntityAdapter.getSelectors((state: AppState) => state.notifications);

export const {
  updateNotificationActivity,
  removeNotification,
} = notificationsSlice.actions;
