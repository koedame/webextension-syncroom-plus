import { srClientWithToken } from './clients';

// ブロック管理
export const BlockRepository = {
  // ブロックに追加
  async add(userId: string): Promise<{ status: 'ok' }> {
    const res = await srClientWithToken().post('https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile/blockedusers/', {
      json: {
        userId,
      },
    });
    return res.json();
  },
  // ブロックから削除
  async remove(userId: string): Promise<{ status: 'ok' }> {
    const res = await srClientWithToken().post(`https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile/blockedusers/${userId}/remove`);
    return res.json();
  },
};
