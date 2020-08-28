export interface RootState {
  version: string;
}

export interface ClockState {
  // momentのオブジェクトが入る
  currentTime: any;
}

export interface FavoriteMembersState {
  members: Array<FavoriteMember>;
}

export interface FavoriteMember {
  memberName: string;
  createdAt: string;
}

export interface NotificationOnlineMembersState {
  members: Array<NotificationOnlineMember>;
}

export interface NotificationOnlineMember {
  memberName: string;
  createdAt: string;
  lastNotificationRoomCreatedTime: string;
}

export interface NotificationVacancyRoomsState {
  rooms: Array<NotificationVacancyRoom>;
}

export interface NotificationVacancyRoom {
  uid: string;
  createdAt: string;
}

export interface ConfigState {
  autoReload: boolean;
  animation: boolean;
}
