import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from '../../lib/i18n';
import { DateTime } from 'luxon';

import { useSession } from '../../hooks/useSession';

import { SYNCROOM } from '../../types/syncroom';
import { iconInfoToUrl } from '../../lib/iconInfoToUrl';
import { UserRepository } from '../../repositories/userRepository';
import { FavoriteRepository } from '../../repositories/favoriteRepository';
import { LockClosedIcon } from '@heroicons/react/solid';

interface Props extends SYNCROOM.UserBasicInfoType {
  index: number;
  onRemove: Function;
}

const Component: React.FC<Props> = ({ userId, nickname, iconInfo, index, onRemove }: Props) => {
  const { t } = useTranslation();
  const { myProfile } = useSession();

  const [user, setUser] = useState<SYNCROOM.UserType>();

  useEffect(() => {
    UserRepository.show(userId).then((res) => setUser(res));
  }, [myProfile]);

  return (
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate">
        <div className="inline-block mr-2">
          <img className="h-10 w-10 rounded-md" src={iconInfoToUrl(iconInfo)} alt="" />
        </div>
        <div className="inline-block align-top">
          <a className="text-blue-600 hover:text-blue-800" href={`https://syncroom.yamaha.com/mypage/user/${userId}`} target="_blank" rel="noopener noreferrer">
            <p>{nickname}</p>
          </a>
          <p className="text-gray-400 inline-flex items-center">
            <span className="relative inline-block mr-1">
              {user?.currentState.type === 'none' && (
                <span className="flex h-3 w-3">
                  <span className="relative rounded-full h-3 w-3 bg-gray-400"></span>
                </span>
              )}

              {user?.currentState.type === 'createRoom' && (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-green-200"></span>
                  <span className="relative rounded-full h-3 w-3 bg-green-400"></span>
                </span>
              )}

              {user?.currentState.type === 'enterRoom' && (
                <span className="flex h-3 w-3">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-yellow-200"></span>
                  <span className="relative rounded-full h-3 w-3 bg-yellow-400"></span>
                </span>
              )}
            </span>
            <span className="inline-block inline-flex items-center">
              {user?.currentState.type === 'none' &&
                (user?.publishStatus === 'hidden'
                  ? t('profile_is_private')
                  : user?.currentState.time === 0
                  ? t('no_activity_history')
                  : `${t('recent_activities')}: ${DateTime.fromMillis(user?.currentState.time * 1000).toLocaleString(DateTime.DATETIME_MED)}`)}
              {user?.currentState.type === 'createRoom' && user?.currentState.needPasswd && (
                <>
                  <LockClosedIcon className="inline-block w-4 h-4" />
                  <span>
                    {t('in_the_room')}: {user?.currentState.roomName}
                  </span>
                </>
              )}
              {user?.currentState.type === 'createRoom' && !user?.currentState.needPasswd && (
                <span>
                  {t('in_the_room')}: {user?.currentState.roomName}
                </span>
              )}
              {user?.currentState.type === 'enterRoom' && t('in_the_room')}
            </span>
          </p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <button
          onClick={() => {
            onRemove(user);
          }}
          className="text-red-600 hover:text-red-900 border-b border-dashed border-red-600 hover:border-red-900"
        >
          {t('remove')}
        </button>
      </td>
    </tr>
  );
};

export default memo(Component);
