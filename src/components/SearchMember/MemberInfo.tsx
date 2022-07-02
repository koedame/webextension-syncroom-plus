import { SYNCROOM } from '../../types/syncroom';
import { UserRepository } from '../../repositories/userRepository';
import { iconInfoToUrl } from '../../lib/iconInfoToUrl';
import { useTranslation } from '../../lib/i18n';

import { css } from '@emotion/css';
import React, { memo, useEffect, useState } from 'react';
import { useRooms } from '../../hooks/useRooms';
import findRoomByUserId from '../../lib/findRoomByUserId';
import { DateTime } from 'luxon';

interface ActivityComponentPropType {
  currentState: SYNCROOM.CurrentStateType;
  publishState: SYNCROOM.PublishStatusType;
  entryRoom: SYNCROOM.RoomType | undefined;
}
const ActivityComponent: React.FC<ActivityComponentPropType> = ({ currentState, publishState, entryRoom }: ActivityComponentPropType) => {
  const { t } = useTranslation();

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
            <span>
              {t('recent_activities')}: {DateTime.fromMillis(currentState.time * 1000).toLocaleString(DateTime.DATETIME_MED)}
            </span>
          );
        }
      }
    }
  } else if (currentState.type === 'createRoom') {
    if (entryRoom) {
      return <span>{`${t('in_the_room')}: ${entryRoom.roomName}`}</span>;
    } else {
      return <span>{`${t('in_the_room')}`}</span>;
    }
  } else if (currentState.type === 'enterRoom') {
    if (entryRoom) {
      return <span>{`${t('in_the_room')}: ${entryRoom.roomName}`}</span>;
    } else {
      return <span>{`${t('in_the_room')}`}</span>;
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
}

const Component: React.FC<Props> = ({ nickname, iconInfo, profileText, userId }: Props) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<SYNCROOM.UserType>();
  const [entryRoom, setEntryRoom] = useState<SYNCROOM.RoomType>();
  const { rooms } = useRooms();

  useEffect(() => {
    UserRepository.show(userId).then((res) => {
      setUser(res);
      setEntryRoom(findRoomByUserId(rooms, res.userId));
    });
  }, []);

  return (
    <div className="bg-white py-4">
      <div className="px-4 whitespace-nowrap text-sm font-medium text-gray-900">
        <div className="inline-block mr-2">
          <img className="h-10 w-10 rounded-md" src={iconInfoToUrl(iconInfo)} alt="" />
        </div>
        <div className="inline-block align-top">
          <a className="text-blue-600 hover:text-blue-800" href={`https://syncroom.yamaha.com/mypage/user/${userId}`} target="_blank" rel="noopener noreferrer">
            <p>{nickname}</p>
          </a>
          <p className="text-gray-700 inline-flex items-center">
            <span className="relative inline-block mr-1">
              {user && <StatusIconComponent currentState={user.currentState} publishState={user.publishStatus} entryRoom={entryRoom} />}
            </span>
            <span className="inline-block inline-flex items-center">
              {user && <ActivityComponent currentState={user.currentState} publishState={user.publishStatus} entryRoom={entryRoom} />}
            </span>
          </p>
        </div>
      </div>
      <div className="px-4 align-top">
        <p className="text-gray-700 truncate">{profileText}</p>
      </div>
    </div>
  );
};
export default memo(Component);
