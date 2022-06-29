import React from 'react';
import { BellIcon, LockClosedIcon } from '@heroicons/react/solid';

import twemoji from 'twemoji';

import { Flipped } from 'react-flip-toolkit';

import { useTranslation } from '../../lib/i18n';
import { SYNCROOM } from '../../types/syncroom';
import { openInSyncroomApp } from '../../lib/openInSyncroomApp';
import { useRoomPasswordPrompt } from '../../hooks/useRoomPasswordPrompt';
import { useNotificationVacancyRooms } from '../../hooks/useNotificationVacancyRooms';

import PublicEntryMember from './PublicEntryMember';
import TemporaryEntryMember from './TemporaryEntryMember';
import RoomCardHeader from './RoomCardHeader';
import { iconInfoToUrl } from '../../lib/iconInfoToUrl';
import { roomRemainingTimeFromCreateTime } from '../../lib/roomRemainingTimeFromCreateTime';
import decryptionTags from '../../lib/decriptionTags';

const FullMemberRoomCardStyle = 'rounded overflow-hidden shadow bg-gray-100 mx-1 mb-4 text-gray-900 w-[300px] h-[460px]';
const UnLockedRoomCardStyle = 'rounded overflow-hidden shadow bg-indigo-100 mx-1 mb-4 text-gray-900 w-[300px] h-[460px]';
const LockedRoomCardStyle = 'rounded overflow-hidden shadow bg-gray-200 mx-1 mb-4 text-gray-900 w-[300px] h-[460px]';

const FullMemberRoomCardHeaderStyle = 'flex justify-between items-center bg-gray-400 text-white px-2 py-1';
const UnLockedRoomCardHeaderStyle = 'flex justify-between items-center bg-indigo-600 text-white px-2 py-1';
const LockedRoomCardHeaderStyle = 'flex justify-between items-center bg-gray-600 text-white px-2 py-1';

const UnLockedRoomCardJoinButtonStyle =
  'flex shadow-sm items-center bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
const LockedRoomCardJoinButtonStyle =
  'flex shadow-sm items-center bg-gray-600 hover:bg-gray-700 text-white rounded py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500';

const roomDescription = (text: string) => {
  const linkedHTML = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
    .replace(/\n/g, '<br />')
    .replace(/(\b(https|http):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi, (link: string) => {
      return `<a class="text-blue-600 hover:text-blue-800" href='${link}' target='_blank' rel='noopener noreferrer'>${link}</a>`;
    })
    .replace(/((@|＠)[0-9a-zA-Z_]{1,15})/g, (twitterID: string) => {
      const noAtTwitterID = twitterID.replace(/@|＠/g, '');
      return `<a class="text-blue-600 hover:text-blue-800" href='https://twitter.com/${noAtTwitterID}' target='_blank' rel='noopener noreferrer'>${twitterID}</a>`;
    });
  return String(twemoji.parse(linkedHTML, { className: 'h-3 w-3 m-1 inline' }));
};

interface Props extends SYNCROOM.RoomType {
  isTestRoom?: boolean;
}

const Component: React.FC<Props> = (props: Props) => {
  const { t } = useTranslation();

  const { addNotificationVacancyRooms, removeNotificationVacancyRooms, isNotificationVacancyRoom } = useNotificationVacancyRooms();

  const emptyMembers = [0, 1, 2, 3, 4, 5].slice(0, 5 - props.members.length);

  const { openRoomPasswordPrompt, setCurrentRoomName } = useRoomPasswordPrompt();

  const onTemporaryJoin = () => {
    if (props.needPasswd) {
      setCurrentRoomName(props.roomName);
      openRoomPasswordPrompt();
    } else {
      openInSyncroomApp(props.roomName, '', true);
    }
  };

  const onJoin = () => {
    if (props.needPasswd) {
      setCurrentRoomName(props.roomName);
      openRoomPasswordPrompt();
    } else {
      openInSyncroomApp(props.roomName, '', false);
    }
  };

  return (
    <Flipped flipId={props.roomName.replace(/"|'/g, '')}>
      <div className={props.members.length === 5 ? FullMemberRoomCardStyle : props.needPasswd ? LockedRoomCardStyle : UnLockedRoomCardStyle}>
        <div className={props.members.length === 5 ? FullMemberRoomCardHeaderStyle : props.needPasswd ? LockedRoomCardHeaderStyle : UnLockedRoomCardHeaderStyle}>
          <RoomCardHeader remaining_time={roomRemainingTimeFromCreateTime(props.createTime)} />
        </div>

        <h3
          className="text-base mx-2 my-2 truncate font-medium"
          dangerouslySetInnerHTML={{ __html: String(twemoji.parse(props.isTestRoom ? t('test_room') : props.roomName, { className: 'h-4 w-4 m-1 inline' })) }}
        ></h3>
        <div className="space-x-2 px-2 overflow-hidden flex items-start flex-wrap h-[26px]">
          {decryptionTags(props.tagMask, props.tagOrig).map((tag) => {
            return (
              <p
                className="inline-block bg-white text-xs shadow-sm px-2 py-1 mb-2 rounded"
                key={`${props.roomName}tag-${tag}`}
                dangerouslySetInnerHTML={{ __html: String(twemoji.parse(tag, { className: 'h-3 w-3 inline' })) }}
              ></p>
            );
          })}
          <div className="inline-block py-1">&#8203;</div>
        </div>

        <p
          className={`my-2 mx-2 px-2 py-1 overflow-y-auto text-xs shadow-sm break-words rounded bg-white leading-[1.8em] h-[calc(1.8em*4)]`}
          dangerouslySetInnerHTML={{ __html: roomDescription(props.isTestRoom ? t('test_room_description') : props.roomDesc) }}
        />

        <div className="mx-2 my-1 divide-y divide-gray-200 rounded bg-white">
          {props.members.map((member, i) => {
            return member.nickname === '' ? (
              <TemporaryEntryMember memberName={member.nickname} key={`${props.roomName}-member-${i}`} />
            ) : (
              <PublicEntryMember
                userId={member.userId}
                iconUrl={iconInfoToUrl(member.iconInfo)}
                memberName={member.nickname}
                roomCreatedAt={props.createTime}
                key={`${props.roomName}-member-${i}`}
              />
            );
          })}

          {/* 空の行を埋めるためのダミー */}
          {emptyMembers.map((_m, i) => {
            return (
              <div className="flex w-full p-1" key={`${props.roomName}-emptyMember-${i}`}>
                <div className="rounded w-8 h-8 mr-2"></div>
              </div>
            );
          })}
        </div>

        {props.members.length === 5 ? (
          <div className="px-2 py-2">
            <button
              onClick={() => {
                const uid = `${props.createTime}||${props.roomName}`;
                if (isNotificationVacancyRoom(uid)) removeNotificationVacancyRooms(uid);
                else addNotificationVacancyRooms(uid);
              }}
              className="inline-flex justify-center items-center w-full text-indigo-600 shadow-sm bg-indigo-100 hover:bg-indigo-200 rounded py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <BellIcon className="h-5 w-5 mr-2" />
              {isNotificationVacancyRoom(`${props.createTime}||${props.roomName}`) ? t('cancel_notification') : t('notification_when_joinable')}
            </button>
          </div>
        ) : (
          <div className="flex justify-between px-2 py-2">
            <button
              onClick={onTemporaryJoin}
              className="shadow-sm bg-gray-50 hover:bg-gray-100 rounded py-2 px-4 text-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {t('temporary_entry')}
            </button>
            <button onClick={onJoin} className={props.needPasswd ? LockedRoomCardJoinButtonStyle : UnLockedRoomCardJoinButtonStyle}>
              {props.needPasswd && <LockClosedIcon className="h-5 w-5 mr-2" />}
              {t('join')}
            </button>
          </div>
        )}
      </div>
    </Flipped>
  );
};

export default React.memo(Component);
