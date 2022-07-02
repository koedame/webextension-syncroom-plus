import { srClientWithToken } from './clients';
import { SYNCROOM } from '../types/syncroom';

// ユーザー情報
export const UserRepository = {
  // ID検索
  async show(userId: string): Promise<SYNCROOM.UserType> {
    const res = await srClientWithToken().get(`https://webapi.syncroom.appservice.yamaha.com/comm/users/${userId}`);
    return res.json();
  },

  // ユーザー情報の一括取得
  async index(userIds: SYNCROOM.UserIdType[]): Promise<SYNCROOM.UserBasicInfoResponseType> {
    const res = await srClientWithToken().post('https://webapi.syncroom.appservice.yamaha.com/comm/users/basicInfo/', {
      json: userIds,
    });
    return res.json();
  },

  // ユーザーをキーワードで検索
  async search(option: SYNCROOM.UserSearchRequestType): Promise<SYNCROOM.UserSearchResponseType> {
    const res = await srClientWithToken().get('https://webapi.syncroom.appservice.yamaha.com/comm/users', {
      searchParams: option,
    });
    return res.json();
  },
};
