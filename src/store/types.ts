export interface RootState {
  version: string;
}

export interface FavoriteMembersState {
  members: FavoriteMember[];
}

export interface FavoriteMember {
  memberName: string;
  createdAt: string;
}

export interface NotificationOnlineMembersState {
  members: NotificationOnlineMember[];
}

export interface NotificationOnlineMember {
  memberName: string;
  createdAt: string;
  lastNotificationRoomCreatedTime: string;
}

export interface NotificationVacancyRoomsState {
  rooms: NotificationVacancyRoom[];
}

export interface NotificationVacancyRoom {
  uid: string;
  createdAt: string;
}

export interface ConfigState {
  autoReload: boolean;
  animation: boolean;
  language: string;
}
