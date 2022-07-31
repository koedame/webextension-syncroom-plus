import { srpClient } from './clients';

export const customImageRepository = {
  // 画像アップロード
  async upload(userId: string, data: FormData, options?: RequestInit): Promise<{ url: string }> {
    const res = await srpClient(`/api/v1/users/${userId}/images`, { ...options, method: 'post', body: data });
    return await res.json();
  },
};
