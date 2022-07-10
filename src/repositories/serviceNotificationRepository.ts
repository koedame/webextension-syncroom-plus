import { srpClient } from './clients';
import { SYNCROOMPlus } from '../types/syncroomPlus';

// お知らせ情報
export const ServiceNotificationRepository = {
  // 最新のお知らせ取得
  async latest(options?: RequestInit): Promise<SYNCROOMPlus.ServiceNotificationType> {
    const res = await srpClient('/api/v1/notifications/latest.json', { ...options, method: 'get' });
    return await res.json();
  },
};
