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
  favoritedAt: Date;
}

export interface NotificationOnlineMembersState {
  members: Array<NotificationOnlineMember>;
}

export interface NotificationOnlineMember {
  memberName: string;
  createdAt: Date;
  lastNotificationRoomCreatedTime: Date;
}

export interface NotificationVacancyRoomsState {
  rooms: Array<NotificationVacancyRoom>;
}

export interface NotificationVacancyRoom {
  uid: string;
  createdAt: Date;
}
