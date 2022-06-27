import React, { useEffect, useState } from 'react';
import { StarIcon, BellIcon, BanIcon } from '@heroicons/react/solid';

import twemoji from 'twemoji';

import { useNotificationOnlineMemberIds } from '../../hooks/useNotificationOnlineMembers';
import { useSession } from '../../hooks/useSession';
import { FavoriteRepository } from '../../repositories/favoriteRepository';
import { BlockRepository } from '../../repositories/blockRepository';
import { useLoginRequired } from '../LoginRequired/Dialog';
import { useTranslation } from 'react-i18next';

interface Props {
  userId: string;
  iconUrl: string;
  memberName: string;
  roomCreatedAt: string;
}

const memberNameEmojify = (text: string) => {
  const linkedText = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');
  const result = String(twemoji.parse(linkedText, { className: 'h-3 w-3 m-1 inline' }));
  return result;
};

const Component: React.FC<Props> = ({ iconUrl, memberName, roomCreatedAt, userId }: Props) => {
  const { t } = useTranslation();

  const isNot15user = userId === '';
  const [isFavoriteMember, setIsFavoriteMember] = useState<boolean>(false);
  const [isBlockMember, setIsBlockMember] = useState<boolean>(false);

  const [isFavoriteProcessing, setIsFavoriteProcessing] = useState<boolean>(false);
  const [isBlockProcessing, setIsBlockProcessing] = useState<boolean>(false);

  const { openLoginRequiredDialog } = useLoginRequired();

  const { isNotificationOnlineMember, addNotificationOnlineMemberFromName, removeNotificationOnlineMemberFromUserId } = useNotificationOnlineMemberIds();

  const { myProfile, reloadMyProfile, isLoggedIn } = useSession();

  useEffect(() => {
    setIsFavoriteMember(!!myProfile?.favoriteUsers.includes(userId));
    setIsBlockMember(!!myProfile?.blockedUsers.includes(userId));
  }, [userId, myProfile]);

  return (
    <div className={`flex w-full p-1 ${isFavoriteMember && 'bg-[#ffffc7]'} ${isBlockMember && 'bg-red-200'}`}>
      <img className="rounded w-8 h-8 mr-2" src={iconUrl} alt={memberName} />
      <div className="flex justify-between items-center w-full mr-1">
        {isNot15user ? (
          <p
            className="truncate inline-block text-xs cursor-not-allowed max-w-[170px] text-gray-900"
            dangerouslySetInnerHTML={{ __html: memberNameEmojify(memberName) }}
            title={t('old_user')}
          />
        ) : (
          <a
            className="truncate inline-block text-xs max-w-[170px] text-blue-600 hover:text-blue-800"
            dangerouslySetInnerHTML={{ __html: memberNameEmojify(memberName) }}
            href={`https://syncroom.yamaha.com/mypage/user/${userId}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(event) => {
              // ログイン必須
              if (!isLoggedIn) {
                event.preventDefault();
                return openLoginRequiredDialog();
              }
            }}
          />
        )}
        <div className="flex space-x-1">
          <button
            title={t('receive_notification_when_online_this_user')}
            onClick={() => {
              if (isNot15user) {
                return false;
              }

              // ログイン必須
              if (!isLoggedIn) {
                return openLoginRequiredDialog();
              }

              if (isNotificationOnlineMember(userId)) removeNotificationOnlineMemberFromUserId(userId);
              else addNotificationOnlineMemberFromName(userId, roomCreatedAt);
            }}
          >
            <BellIcon
              className={
                isNot15user
                  ? 'h-4 w-4 text-gray-100 cursor-not-allowed'
                  : isNotificationOnlineMember(userId)
                  ? 'h-4 w-4 text-yellow-500 hover:text-yellow-700'
                  : 'h-4 w-4 text-gray-400 hover:text-gray-600'
              }
            />
          </button>
          <button
            title={t('color_it_to_make_it_easier_to_find')}
            onClick={() => {
              if (isNot15user) {
                return false;
              }

              // ログイン必須
              if (!isLoggedIn) {
                return openLoginRequiredDialog();
              }

              setIsFavoriteProcessing(true);

              if (isFavoriteMember) {
                FavoriteRepository.remove(userId).then((res) => {
                  reloadMyProfile().then((r) => {
                    setIsFavoriteProcessing(false);
                  });
                });
              } else {
                FavoriteRepository.add(userId).then((res) => {
                  reloadMyProfile().then((r) => {
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
              <StarIcon
                className={
                  isNot15user
                    ? 'h-4 w-4 text-gray-100 cursor-not-allowed'
                    : isFavoriteMember
                    ? 'h-4 w-4 text-yellow-500 hover:text-yellow-700'
                    : 'h-4 w-4 text-gray-400 hover:text-gray-600'
                }
              />
            )}
          </button>
          <button
            title={t('block_user')}
            onClick={() => {
              if (isNot15user) {
                return false;
              }

              // ログイン必須
              if (!isLoggedIn) {
                return openLoginRequiredDialog();
              }

              setIsBlockProcessing(true);

              if (isBlockMember) {
                BlockRepository.remove(userId).then((res) => {
                  reloadMyProfile().then((r) => {
                    setIsBlockProcessing(false);
                  });
                });
              } else {
                BlockRepository.add(userId).then((res) => {
                  reloadMyProfile().then((r) => {
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
              <BanIcon
                className={
                  isNot15user ? 'h-4 w-4 text-gray-100 cursor-not-allowed' : isBlockMember ? 'h-4 w-4 text-red-500 hover:text-red-700' : 'h-4 w-4 text-gray-400 hover:text-gray-600'
                }
              />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Component);
