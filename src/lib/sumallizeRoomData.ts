import { SYNCROOM } from '../types/syncroom';
import { SYNCROOMPlus } from '../types/syncroomPlus';
import decryptionTags from './decriptionTags';

const sumallizeRoomData = (rooms: SYNCROOM.RoomType[]) => {
  const AggregatedTags: SYNCROOMPlus.AggregatedTagType[] = [];
  const LockedAggregatedTags: SYNCROOMPlus.AggregatedTagType[] = [];
  const UnlockedAggregatedTags: SYNCROOMPlus.AggregatedTagType[] = [];

  let TestRoom: SYNCROOM.TestRoomType | null = null;
  let PublicRoomsCount: number = 0;
  let PublicLockedRoomsCount: number = 0;
  let PublicUnlockedRoomsCount: number = 0;

  for (const room of rooms) {
    if (room.roomName === '接続テストルーム') {
      TestRoom = room as SYNCROOM.TestRoomType;
    } else {
      const roomTags = decryptionTags(room.tagMask, room.tagOrig);
      // 部屋数集計
      PublicRoomsCount += 1;

      if (room.needPasswd) {
        PublicLockedRoomsCount += 1;
      } else {
        PublicUnlockedRoomsCount += 1;
      }

      // タグ集計
      for (const roomTag of roomTags) {
        const hitTag = AggregatedTags.find((tag) => tag.name === roomTag);
        if (hitTag) {
          hitTag.count += 1;
        } else {
          AggregatedTags.push({ name: roomTag, count: 1 });
        }

        if (room.needPasswd) {
          const hitTag = LockedAggregatedTags.find((tag) => tag.name === roomTag);
          if (hitTag) {
            hitTag.count += 1;
          } else {
            LockedAggregatedTags.push({ name: roomTag, count: 1 });
          }
        } else {
          const hitTag = UnlockedAggregatedTags.find((tag) => tag.name === roomTag);
          if (hitTag) {
            hitTag.count += 1;
          } else {
            UnlockedAggregatedTags.push({ name: roomTag, count: 1 });
          }
        }
      }
    }
  }

  return {
    AggregatedTags,
    LockedAggregatedTags,
    UnlockedAggregatedTags,
    TestRoom,
    PublicRoomsCount,
    PublicLockedRoomsCount,
    PublicUnlockedRoomsCount,
  };
};

export default sumallizeRoomData;
