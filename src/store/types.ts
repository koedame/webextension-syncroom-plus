export interface RootState {
  version: string;
}

export interface FavoriteMember {
  memberName: string;
  createdAt: string;
}

export interface FavoriteMembersState {
  members: FavoriteMember[];
}

export interface NotificationOnlineMember {
  memberName: string;
  createdAt: string;
  lastNotificationRoomCreatedTime: string;
}

export interface NotificationOnlineMembersState {
  members: NotificationOnlineMember[];
}

export interface NotificationVacancyRoom {
  uid: string;
  createdAt: string;
}

export interface NotificationVacancyRoomsState {
  rooms: NotificationVacancyRoom[];
}

export interface ConfigState {
  autoReload: boolean;
  animation: boolean;
  rememberPassword: boolean;
  language: string;
}
