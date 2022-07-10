import { srClient } from './clients';
import { SYNCROOM } from '../types/syncroom';

// 公式APIからの部屋情報取得
export const RoomRepository = {
  // 部屋一覧情報取得（非ログイン時用）
  async unauthedList(options?: RequestInit): Promise<SYNCROOM.RoomsResponseType> {
    const res = await srClient('https://webapi.syncroom.appservice.yamaha.com/comm/public/room_list?pagesize=500&realm=4', { ...options, method: 'get' });
    return res.json();
  },

  // 価値ある情報は含まれていないので未使用
  // 部屋一覧情報取得（ログイン時用）
  // async authedList(): Promise<SYNCROOM.RoomsResponseType> {
  //   const res = await srClientWithToken().get('https://webapi.syncroom.appservice.yamaha.com/comm/room_list?pagesize=500&realm=4')
  //   return res.json()
  // },
};
