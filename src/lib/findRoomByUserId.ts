import { SYNCROOM } from '../types/syncroom';

// ユーザーが存在するルーム情報を取得
const findRoomByUserId = (rooms: SYNCROOM.RoomType[], userId: SYNCROOM.UserIdType): SYNCROOM.RoomType | undefined => {
  return rooms.find((r) => {
    return r.members.find((m) => m.userId === userId);
  });
};

export default findRoomByUserId;
