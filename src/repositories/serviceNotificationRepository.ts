import { srpClient } from './clients';
import { SYNCROOMPlus } from '../types/syncroomPlus';

// お知らせ情報
export const ServiceNotificationRepository = {
  // 最新のお知らせ取得
  async latest(): Promise<SYNCROOMPlus.ServiceNotificationType> {
    const res = await srpClient.get('api/v1/notifications/latest.json');
    return res.json();
  },
};
