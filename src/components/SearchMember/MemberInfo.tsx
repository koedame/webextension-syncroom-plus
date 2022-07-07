import { SYNCROOM } from '../../types/syncroom';
import { UserRepository } from '../../repositories/userRepository';
import { iconInfoToUrl } from '../../lib/iconInfoToUrl';
import { useTranslation } from '../../lib/i18n';

import React, { memo, useEffect, useState } from 'react';
import { useRooms } from '../../hooks/useRooms';
import findRoomByUserId from '../../lib/findRoomByUserId';
import { DateTime } from 'luxon';
import { dateTimeFromNow } from '../../lib/dateTimeFromNow';
import { BanIcon, BellIcon, StarIcon } from '@heroicons/react/solid';
import { useNotificationOnlineMemberIds } from '../../hooks/useNotificationOnlineMembers';
import { useSession } from '../../hooks/useSession';
import { FavoriteRepository } from '../../repositories/favoriteRepository';
import { BlockRepository } from '../../repositories/blockRepository';

interface ActivityComponentPropType {
  currentState: SYNCROOM.CurrentStateType;
  publishState: SYNCROOM.PublishStatusType;
  entryRoom: SYNCROOM.RoomType | undefined;
}
const ActivityComponent: React.FC<ActivityComponentPropType> = ({ currentState, publishState, entryRoom }: ActivityComponentPropType) => {
  const { t } = useTranslation();

  const fromNow = dateTimeFromNow(currentState.time * 1000);

  if (currentState.type === 'none') {
    if (entryRoom) {
      return <span>{`${t('in_the_room')}: ${entryRoom.roomName}`}</span>;
    } else {
      if (publishState === 'hidden') {
        return <span>{t('profile_is_private')}</span>;
      } else {
        if (currentState.time === 0) {
          return <span>{t('no_activity_history')}</span>;
        } else {
          return (
            <span title={DateTime.fromMillis(currentState.time * 1000).toLocaleString(DateTime.DATETIME_MED)}>
              {fromNow.type === 'seconds' && `${t('recent_activities')}: ${fromNow.duration} ${t('seconds_ago')}`}
              {fromNow.type === 'minutes' && `${t('recent_activities')}: ${fromNow.duration} ${t('minutes_ago')}`}
              {fromNow.type === 'hours' && `${t('recent_activities')}: ${fromNow.duration} ${t('hours_ago')}`}
              {fromNow.type === 'days' && `${t('recent_activities')}: ${fromNow.duration} ${t('days_ago')}`}
              {fromNow.type === 'weeks' && `${t('recent_activities')}: ${fromNow.duration} ${t('weeks_ago')}`}
              {fromNow.type === 'months' && `${t('recent_activities')}: ${fromNow.duration} ${t('months_ago')}`}
              {fromNow.type === 'years' && `${t('recent_activities')}: ${fromNow.duration} ${t('years_ago')}`}
            </span>
          );
        }
      }
    }
  } else if (currentState.type === 'createRoom') {
    if (entryRoom) {
      return <span>{`${t('creating_the_room')}: ${entryRoom.roomName}`}</span>;
    } else {
      return <span>{t('creating_the_private_room')}</span>;
    }
  } else if (currentState.type === 'enterRoom') {
    if (entryRoom) {
      return <span>{`${t('in_the_room')}: ${entryRoom.roomName}`}</span>;
    } else {
      return <span>{t('in_the_private_room')}</span>;
    }
  }
  return null;
};

const StatusIconComponent: React.FC<ActivityComponentPropType> = ({ currentState, publishState, entryRoom }: ActivityComponentPropType) => {
  if (currentState.type === 'none') {
    if (entryRoom) {
      return (
        <span className="flex h-3 w-3">
          <span className="animate-ping absolute h-full w-full rounded-full bg-green-200"></span>
          <span className="relative rounded-full h-3 w-3 bg-green-400"></span>
        </span>
      );
    } else {
      if (publishState === 'hidden') {
        return (
          <span className="flex h-3 w-3">
            <span className="relative rounded-full h-3 w-3 bg-gray-400"></span>
          </span>
        );
      } else {
        if (currentState.time === 0) {
          return (
            <span className="flex h-3 w-3">
              <span className="relative rounded-full h-3 w-3 bg-gray-400"></span>
            </span>
          );
        } else {
          return (
            <span className="flex h-3 w-3">
              <span className="relative rounded-full h-3 w-3 bg-gray-400"></span>
            </span>
          );
        }
      }
    }
  } else if (currentState.type === 'createRoom') {
    return (
      <span className="flex h-3 w-3">
        <span className="animate-ping absolute h-full w-full rounded-full bg-green-200"></span>
        <span className="relative rounded-full h-3 w-3 bg-green-400"></span>
      </span>
    );
  } else if (currentState.type === 'enterRoom') {
    return (
      <span className="flex h-3 w-3">
        <span className="animate-ping absolute h-full w-full rounded-full bg-green-200"></span>
        <span className="relative rounded-full h-3 w-3 bg-green-400"></span>
      </span>
    );
  }
  return null;
};

interface Props {
  nickname: string;
  iconInfo: SYNCROOM.IconInfoType;
  profileText: string;
  userId: string;
  index: number;
}

const Component: React.FC<Props> = ({ nickname, iconInfo, profileText, userId, index }: Props) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<SYNCROOM.UserType>();
  const [entryRoom, setEntryRoom] = useState<SYNCROOM.RoomType>();
  const { rooms } = useRooms();

  const { isNotificationOnlineMember, addNotificationOnlineMemberFromName, removeNotificationOnlineMemberFromUserId } = useNotificationOnlineMemberIds();
  const [isFavoriteProcessing, setIsFavoriteProcessing] = useState<boolean>(false);
  const [isFavoriteMember, setIsFavoriteMember] = useState<boolean>(false);
  const [isBlockMember, setIsBlockMember] = useState<boolean>(false);
  const [isBlockProcessing, setIsBlockProcessing] = useState<boolean>(false);

  const { myProfile, reloadMyProfile } = useSession();

  useEffect(() => {
    UserRepository.show(userId).then((res) => {
      setUser(res);
      setEntryRoom(findRoomByUserId(rooms, res.userId));
    });
  }, []);

  useEffect(() => {
    setIsFavoriteMember(!!myProfile?.favoriteUsers.includes(userId));
    setIsBlockMember(!!myProfile?.blockedUsers.includes(userId));
  }, [userId, myProfile]);

  return (
    <div className={index % 2 === 0 ? 'bg-white py-4' : 'bg-gray-50 py-4'}>
      <div className="px-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="inline-block mr-2">
          {user ? (
            <img className="h-10 w-10 rounded-md" src={iconInfoToUrl(user.iconInfo)} alt="" />
          ) : (
            <img className="h-10 w-10 rounded-md" src={iconInfoToUrl(iconInfo)} alt="" />
          )}
        </div>
        <div className="inline-block align-top">
          <a className="text-blue-600 hover:text-blue-800" href={`https://syncroom.yamaha.com/mypage/user/${userId}`} target="_blank" rel="noopener noreferrer">
            <p>{nickname}</p>
          </a>
          <div className="text-gray-700 inline-flex items-center">
            <span className="relative inline-block mr-1">
              {user && <StatusIconComponent currentState={user.currentState} publishState={user.publishStatus} entryRoom={entryRoom} />}
            </span>
            <span className="inline-block inline-flex items-center">
              {user && <ActivityComponent currentState={user.currentState} publishState={user.publishStatus} entryRoom={entryRoom} />}
            </span>
          </div>
        </div>
        <div className=" float-right flex space-x-1">
          <button
            title={t('receive_notification_when_online_this_user')}
            onClick={() => {
              if (isNotificationOnlineMember(userId)) removeNotificationOnlineMemberFromUserId(userId);
              else addNotificationOnlineMemberFromName(userId, 'roomCreatedAt');
            }}
          >
            <BellIcon className={isNotificationOnlineMember(userId) ? 'h-4 w-4 text-yellow-500 hover:text-yellow-700' : 'h-4 w-4 text-gray-400 hover:text-gray-600'} />
          </button>
          <button
            title={t('color_it_to_make_it_easier_to_find')}
            onClick={() => {
              setIsFavoriteProcessing(true);

              if (isFavoriteMember) {
                FavoriteRepository.remove(userId).then((_res) => {
                  reloadMyProfile().then((_res2) => {
                    setIsFavoriteProcessing(false);
                  });
                });
              } else {
                FavoriteRepository.add(userId).then((_res) => {
                  reloadMyProfile().then((_res2) => {
                    setIsFavoriteProcessing(false);
                  });
                });
              }
            }}
          >
            {isFavoriteProcessing ? (
              <div className="flex justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <StarIcon className={isFavoriteMember ? 'h-4 w-4 text-yellow-500 hover:text-yellow-700' : 'h-4 w-4 text-gray-400 hover:text-gray-600'} />
            )}
          </button>
          <button
            title={t('block_user')}
            onClick={() => {
              setIsBlockProcessing(true);

              if (isBlockMember) {
                BlockRepository.remove(userId).then((_res) => {
                  reloadMyProfile().then((_res2) => {
                    setIsBlockProcessing(false);
                  });
                });
              } else {
                BlockRepository.add(userId).then((_res) => {
                  reloadMyProfile().then((_res2) => {
                    setIsBlockProcessing(false);
                  });
                });
              }
            }}
          >
            {isBlockProcessing ? (
              <div className="flex justify-center">
                <div className="animate-spin h-4 w-4 border-2 border-indigo-500 rounded-full border-t-transparent"></div>
              </div>
            ) : (
              <BanIcon className={isBlockMember ? 'h-4 w-4 text-red-500 hover:text-red-700' : 'h-4 w-4 text-gray-400 hover:text-gray-600'} />
            )}
          </button>
        </div>
      </div>
      <div className="px-4 align-top">
        <p className="text-gray-700 truncate">{profileText}</p>
      </div>
    </div>
  );
};
export default memo(Component);
