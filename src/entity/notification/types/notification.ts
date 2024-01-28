export enum NotificationType {
  Success = 1,
  Error,
}

export interface INotification {
  id: string;
  createdAt: number;
  title: string;
  description?: string;
  type: NotificationType;
  lifetime: number;
  lastInteractionAt: number,
  isUnderInteraction: boolean,
  buttons: {
    text: string;
    action: string;
    icon?: string;
  }[],
}
