import { srClientWithToken } from './clients';
import { SYNCROOM } from '../types/syncroom';

// 認証
export const SessionRepository = {
  // 自分の情報取得
  async myProfile(): Promise<SYNCROOM.MyProfileType> {
    const res = await srClientWithToken().get('https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile');
    return res.json();
  },

  // ログアウト処理
  async logout(): Promise<{ status: 'ok' }> {
    const res = await srClientWithToken().post('https://webapi.syncroom.appservice.yamaha.com/comm/logout');
    return res.json();
  },
};
