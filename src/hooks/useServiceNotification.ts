import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { ServiceNotificationRepository } from '../repositories/serviceNotificationRepository';
import { SYNCROOMPlus } from '../types/syncroomPlus';

export const useServiceNotification = () => {
  const [color, setColor] = useState<'blue' | 'green' | 'yellow' | 'red'>('yellow');
  const [isShow, setIsShow] = useState<boolean>(false);
  const [serviceNotification, setServiceNotification] = useState<SYNCROOMPlus.ServiceNotificationType | null>(null);

  const fetchServiceNotification = () => {
    ServiceNotificationRepository.latest()
      .then((res) => {
        setServiceNotification(res);
      })
      .catch((error) => {
        // エラーで停止しないようにキャッチして握りつぶしておく
        console.error('お知らせ取得失敗', error);
      });
  };

  useEffect(() => {
    if (serviceNotification) {
      // 通知期間の判定
      const now = DateTime.now();
      setIsShow(DateTime.fromISO(serviceNotification.start_at) < now && DateTime.fromISO(serviceNotification.end_at) > now);

      // メインカラーを設定
      if (serviceNotification.notification_type === 'info') setColor('blue');
      else if (serviceNotification.notification_type === 'success') setColor('green');
      else if (serviceNotification.notification_type === 'warning') setColor('yellow');
      else if (serviceNotification.notification_type === 'danger') setColor('red');
      else setColor('blue');
    }
  }, [serviceNotification]);

  return {
    color,
    isShow,
    serviceNotification,
    fetchServiceNotification,
  };
};
