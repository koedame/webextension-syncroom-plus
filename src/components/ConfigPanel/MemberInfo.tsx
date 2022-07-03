import React, { memo, useEffect, useState } from 'react';
import { useTranslation } from '../../lib/i18n';
import { DateTime } from 'luxon';

import { SYNCROOM } from '../../types/syncroom';
import { iconInfoToUrl } from '../../lib/iconInfoToUrl';
import { UserRepository } from '../../repositories/userRepository';
import findRoomByUserId from '../../lib/findRoomByUserId';
import { useRooms } from '../../hooks/useRooms';

interface Props extends SYNCROOM.UserBasicInfoType {
  index: number;
  onRemove: Function;
}

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

const Component: React.FC<Props> = ({ userId, nickname, iconInfo, index, onRemove }: Props) => {
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
    <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 truncate">
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
