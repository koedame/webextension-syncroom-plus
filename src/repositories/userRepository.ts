import { srClientWithToken } from './clients';
import { SYNCROOM } from '../types/syncroom';

// ユーザー情報
export const UserRepository = {
  // ID検索
  async show(userId: string): Promise<SYNCROOM.UserType> {
    const res = await srClientWithToken(`https://webapi.syncroom.appservice.yamaha.com/comm/users/${userId}`);
    return res.json();
  },

  // ユーザー情報の一括取得
  async index(userIds: SYNCROOM.UserIdType[]): Promise<SYNCROOM.UserBasicInfoResponseType> {
    const res = await srClientWithToken('https://webapi.syncroom.appservice.yamaha.com/comm/users/basicInfo/', {
      method: 'post',
      body: JSON.stringify(userIds),
    });
    return res.json();
  },

  // ユーザーをキーワードで検索
  // 検索結果が非同期で返ってくるのでリクエストを破棄できるようにabortに対応
  async searchWithSignal(params: SYNCROOM.UserSearchRequestType, signal: AbortSignal): Promise<SYNCROOM.UserSearchResponseType> {
    const res = await srClientWithToken(
      // not assignable になるため any に変換している。問題は起こらないはず。
      'https://webapi.syncroom.appservice.yamaha.com/comm/users?' + new URLSearchParams(params as any),
      {
        signal: signal,
      }
    );

    return res.json();
  },
};
