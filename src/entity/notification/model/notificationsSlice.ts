import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {INotification} from '../types/notification';
import {AppState} from '../../../shared/lib/store/appState';

const notificationsEntityAdapter = createEntityAdapter<INotification>({
  selectId: (notification) => notification.id,
  sortComparer: (notificationA, notificationB) => notificationA.createdAt - notificationB.createdAt,
});

export const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: notificationsEntityAdapter.getInitialState(),
  reducers: {
    updateNotificationInteractions(state, action: PayloadAction<{id: string, isUnderInteraction: boolean}>) {
      const notification = state.entities[action.payload.id];

      if (!notification) return;

      notification.isUnderInteraction = action.payload.isUnderInteraction;
      notification.lastInteractionAt = Date.now();
    },
    removeNotification(state, action: PayloadAction<{id: string}>) {
      notificationsEntityAdapter.removeOne(state, action.payload.id);
    },
    addNotification(state, action: PayloadAction<INotification>) {
      notificationsEntityAdapter.addOne(state, action);
    },
  },
});

export const notificationsSliceReducer = notificationsSlice.reducer;

export const notificationsAdapterSelectors = notificationsEntityAdapter.getSelectors((state: AppState) => state.notifications);

export const {
  updateNotificationInteractions,
  removeNotification,
  addNotification,
} = notificationsSlice.actions;
