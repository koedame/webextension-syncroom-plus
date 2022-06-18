import React, { memo } from 'react';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { ChevronRightIcon } from '@heroicons/react/outline';
import { useSession } from '../../hooks/useSession';
import { useTranslation } from 'react-i18next';

interface Props {}

const Component: React.VFC<Props> = ({}: Props) => {
  const { t } = useTranslation();
  const { isLoggedIn } = useSession();

  return isLoggedIn ? null : (
    <div className="rounded-md bg-blue-50 p-4 m-4 max-w-[1223px] mx-auto">
      <div className="flex">
        <div className="flex-shrink-0">
          <InformationCircleIcon className={`h-5 w-5 text-blue-400`} />
        </div>
        <div className="ml-3 w-full">
          <h3 className={`text-sm font-bold text-bold text-blue-800`}>{t('login_title')}</h3>
          <p className={`mt-2 text-sm text-blue-700 break-all`}>{t('login_message_body')}</p>
          <a
            href="https://webapi.syncroom.appservice.yamaha.com/comm/static/login.html"
            className="mt-2 block inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {t('login')}
            <ChevronRightIcon className="block h-5 w-5 ml-2" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default memo(Component);
