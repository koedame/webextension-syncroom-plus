import React, { memo, useEffect, useState } from 'react';
import { StarIcon } from '@heroicons/react/solid';
import { useTranslation } from '../../../lib/i18n';

import { useSession } from '../../../hooks/useSession';

import RemoveDialog from './RemoveDialog';
import RemovedToast from './RemovedToast';

import { FavoriteRepository } from '../../../repositories/favoriteRepository';
import MemberInfo from '../MemberInfo';
import { UserRepository } from '../../../repositories/userRepository';
import { SYNCROOM } from '../../../types/syncroom';
import formatUserBasicInfo from '../../../lib/formatUserBasicInfo';

interface Props {}
const Component: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation();
  const { myProfile, reloadMyProfile } = useSession();

  const [users, setUsers] = useState<SYNCROOM.UserBasicInfoResponseType>([]);

  const [removeUser, setRemoveUser] = useState<SYNCROOM.UserType>();
  const [removeDialogOpenState, setRemoveDialogOpenState] = useState<boolean>(false);
  const [removedToastOpenState, setRemovedToastOpenState] = useState<boolean>(false);
  const [isRemoveProcessing, setIsRemoveProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (myProfile) {
      UserRepository.index(myProfile.favoriteUsers).then((res) => setUsers(res));
    }
  }, [myProfile]);

  return (
    <div className="sm:px-6 sm:py-5">
      <div className="mt-4 text-sm text-gray-900 ">
        {myProfile?.favoriteUsers.length === 0 ? (
          <div className="bg-yellow-50 text-sm text-yellow-700 rounded p-4">
            {t('missing_favorites1')}
            <StarIcon className="h-4 w-4 text-yellow-600 inline-block" />
            {t('missing_favorites2')}
          </div>
        ) : (
          <div className="border border-gray-200 rounded">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {formatUserBasicInfo(users).map((user, index) => {
                  return (
                    <MemberInfo
                      key={`favorite-member-${user.userId}`}
                      {...user}
                      index={index}
                      onRemove={(user: SYNCROOM.UserType) => {
                        setRemoveUser(user);
                        setRemoveDialogOpenState(true);
                      }}
                    />
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <RemoveDialog
        memberName={removeUser?.nickname || ''}
        isOpen={removeDialogOpenState}
        isRemoveProcessing={isRemoveProcessing}
        onClose={() => {
          setRemoveDialogOpenState(false);
        }}
        onOk={() => {
          if (removeUser) {
            setIsRemoveProcessing(true);
            FavoriteRepository.remove(removeUser.userId).then((_res) => {
              reloadMyProfile().then((_res2) => {
                setRemoveUser(undefined);
                setRemoveDialogOpenState(false);
                setRemovedToastOpenState(true);
                setIsRemoveProcessing(false);
              });
            });

            setTimeout(() => {
              if (setRemovedToastOpenState) {
                setRemovedToastOpenState(false);
              }
            }, 5000);
          }
        }}
      />

      <RemovedToast
        isOpen={removedToastOpenState}
        onClose={() => {
          setRemovedToastOpenState(false);
        }}
      />
    </div>
  );
};

export default memo(Component);
