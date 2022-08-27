import React, { useEffect } from 'react';
import { DateTime } from 'luxon';
import { ExclamationCircleIcon, XCircleIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/20/solid';
import { useServiceNotification } from '../../hooks/useServiceNotification';

interface Props {}

const Component: React.VFC<Props> = ({}: Props) => {
  const { color, isShow, serviceNotification, fetchServiceNotification } = useServiceNotification();

  // お知らせ情報の定期読み込み
  useEffect(() => {
    fetchServiceNotification();

    let fetchTimer = setInterval(() => {
      fetchServiceNotification();
    }, 1000 * 60);

    return () => {
      clearInterval(fetchTimer);
    };
  }, []);

  if (isShow) {
    return (
      serviceNotification && (
        <div className={`rounded-md bg-${color}-50 p-4 m-4`}>
          {/* Tailwindに生成させるためのダミー */}
          <span
            className="
          text-blue-400 bg-blue-50 text-blue-700 text-blue-800
          text-green-400 bg-green-50 text-green-700 text-green-800
          text-yellow-400 bg-yellow-50 text-yellow-700 text-yellow-800
          text-red-400 bg-red-50 text-red-700 text-red-800
          hidden
        "
          ></span>
          <div className="flex">
            <div className="flex-shrink-0">
              {serviceNotification.notification_type === 'info' && <InformationCircleIcon className={`h-5 w-5 text-${color}-400`} />}
              {serviceNotification.notification_type === 'success' && <CheckCircleIcon className={`h-5 w-5 text-${color}-400`} />}
              {serviceNotification.notification_type === 'warning' && <ExclamationCircleIcon className={`h-5 w-5 text-${color}-400`} />}
              {serviceNotification.notification_type === 'danger' && <XCircleIcon className={`h-5 w-5 text-${color}-400`} />}
            </div>
            <div className="ml-3 w-full">
              <h3 className={`text-sm font-bold text-bold text-${color}-800`}>{serviceNotification.title}</h3>
              <p className={`mt-2 text-sm text-${color}-700 break-all`}>{serviceNotification.description}</p>
              <p className={`mt-2 text-sm text-${color}-700 text-right`}>{DateTime.fromISO(serviceNotification.start_at).toLocaleString()}</p>
            </div>
          </div>
        </div>
      )
    );
  } else {
    return null;
  }
};

export default React.memo(Component);
