import { srClientWithToken } from './clients';
import { SYNCROOM } from '../types/syncroom';

// 認証
export const SessionRepository = {
  // 自分の情報取得
  async myProfile(): Promise<SYNCROOM.MyProfileType> {
    const res = await srClientWithToken('https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile');
    return res.json();
  },

  // 自分の情報更新
  async updateMyProfile(params: SYNCROOM.MyProfileEditRequestType): Promise<SYNCROOM.MyProfileType> {
    const res = await srClientWithToken('https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile', {
      method: 'post',
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // ツイッター連携設定更新
  async updateTwitterConfig(params: {
    profileLinked: {
      type: 'twitter';
      linkNickname: boolean;
      linkImage: boolean;
    };
    autoTweet: {
      roomCreated: boolean;
    };
  }): Promise<{ status: 'ok' }> {
    const res = await srClientWithToken('https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile', {
      method: 'post',
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // ツイッター連携用URL取得
  async getConnectTwitterLink(): Promise<{ url: string }> {
    const res = await srClientWithToken('https://webapi.syncroom.appservice.yamaha.com/comm/twitter/link_url?callbackURL=https%3A%2F%2Fsyncroom.yamaha.com%2Fplay%2F', {
      method: 'get',
    });
    return res.json();
  },

  // ツイッター連携解除
  async unlinkTwitter(): Promise<SYNCROOM.MyProfileType> {
    const res = await srClientWithToken('https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile', {
      method: 'post',
      body: JSON.stringify({
        profileLinked: {
          type: 'none',
          linkNickname: false,
          linkImage: false,
        },
        autoTweet: false,
      }),
    });
    return res.json();
  },

  // ログアウト処理
  async logout(): Promise<{ status: 'ok' }> {
    const res = await srClientWithToken('https://webapi.syncroom.appservice.yamaha.com/comm/logout', {
      method: 'post',
    });
    return res.json();
  },
};
