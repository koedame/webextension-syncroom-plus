import { atom, useRecoilState } from 'recoil';

import { SYNCROOM } from '../types/syncroom';

const roomsState = atom<SYNCROOM.RoomType[]>({
  key: 'rooms',
  default: [],
});

export const useRooms = () => {
  const [rooms, setRooms] = useRecoilState(roomsState);

  return {
    rooms,
    setRooms,
  };
};
