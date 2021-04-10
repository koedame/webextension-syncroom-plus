import decryptionTags from './decryption_tags';

const parseRooms = (rooms: any) => {
  let publicRooms = rooms.filter((room: any) => room.room_name !== '接続テストルーム');

  let allTags: string[] = [];
  let lockedRoomTags: string[] = [];
  let unlockedRoomTags: string[] = [];

  // タグを復号
  for (let i = 0; i < publicRooms.length; i++) {
    const roomTags = decryptionTags(publicRooms[i]);
    publicRooms[i].room_tags = roomTags;
    allTags = allTags.concat(roomTags);

    if (publicRooms[i].need_passwd) {
      lockedRoomTags = lockedRoomTags.concat(roomTags);
    } else {
      unlockedRoomTags = unlockedRoomTags.concat(roomTags);
    }
  }

  // タグを集計
  const calcedTags = allTags.reduce((result, current) => {
    const element = result.find((value) => value.name === current);
    if (element) {
      element.count++;
    } else {
      result.push({
        name: current,
        count: 1,
      });
    }
    return result;
  }, []);

  // タグを集計
  const calcedLockedRoomTags = lockedRoomTags.reduce((result, current) => {
    const element = result.find((value) => value.name === current);
    if (element) {
      element.count++;
    } else {
      result.push({
        name: current,
        count: 1,
      });
    }
    return result;
  }, []);

  // タグを集計
  const calcedUnlockedRoomTags = unlockedRoomTags.reduce((result, current) => {
    const element = result.find((value) => value.name === current);
    if (element) {
      element.count++;
    } else {
      result.push({
        name: current,
        count: 1,
      });
    }
    return result;
  }, []);

  const lockedRooms = publicRooms.filter((room: any) => room.need_passwd);
  const lockedRoomCount = lockedRooms.length;
  const unlockedRooms = publicRooms.filter((room: any) => !room.need_passwd);
  const unlockedRoomCount = unlockedRooms.length;

  const testRoom = rooms.find((room: any) => room.room_name === '接続テストルーム');

  return {
    publicRooms,
    calcedTags,
    calcedLockedRoomTags,
    calcedUnlockedRoomTags,
    lockedRoomCount,
    unlockedRoomCount,
    testRoom
  }
}

export default parseRooms;
