import { srClientWithToken } from './clients';

// お気に入り管理
export const FavoriteRepository = {
  // お気に入りに追加
  async add(userId: string): Promise<{ status: 'ok' }> {
    const res = await srClientWithToken().post('https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile/favoriteusers/', {
      json: {
        userId,
      },
    });
    return res.json();
  },
  // お気に入りから削除
  async remove(userId: string): Promise<{ status: 'ok' }> {
    const res = await srClientWithToken().post(`https://webapi.syncroom.appservice.yamaha.com/comm/users/me/profile/favoriteusers/${userId}/remove`);
    return res.json();
  },
};
