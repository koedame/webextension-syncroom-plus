import { srClientWithToken } from './clients';
import { SYNCROOM } from '../types/syncroom';
import ky from 'ky';

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
  // 検索結果が非同期で返ってくるのでリクエストを破棄できるようにabortに対応
  async searchWithSignal(option: SYNCROOM.UserSearchRequestType, signal: AbortSignal): Promise<SYNCROOM.UserSearchResponseType> {
    const headers = new Headers();
    headers.set('authorization', localStorage.getItem('token') || '');

    const res = await ky('https://webapi.syncroom.appservice.yamaha.com/comm/users', {
      headers,
      searchParams: option,
      signal: signal,
    });

    return res.json();
  },
};
