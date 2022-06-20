import React, { memo, useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/solid';

import { useTranslation } from '../../../lib/i18n';
import { useNotificationOnlineMemberIds } from '../../../hooks/useNotificationOnlineMembers';

import RemoveDialog from './RemoveDialog';
import RemovedToast from './RemovedToast';
import { SYNCROOM } from '../../../types/syncroom';
import { UserRepository } from '../../../repositories/userRepository';
import MemberInfo from '../MemberInfo';
import formatUserBasicInfo from '../../../lib/formatUserBasicInfo';

interface Props {}

const Component: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation();
  const { notificationOnlineMemberIds, removeNotificationOnlineMemberFromUserId, reloadNotificationOnlineMemberIds } = useNotificationOnlineMemberIds();

  const [removeUser, setRemoveUser] = useState<SYNCROOM.UserType>();
  const [removeDialogOpenState, setRemoveDialogOpenState] = useState<boolean>(false);
  const [removedToastOpenState, setRemovedToastOpenState] = useState<boolean>(false);

  const [users, setUsers] = useState<SYNCROOM.UserBasicInfoResponseType>([]);

  useEffect(() => {
    UserRepository.index(notificationOnlineMemberIds.map((m) => m.userId)).then((res) => setUsers(res));
  }, [notificationOnlineMemberIds]);

  return (
    <div className="sm:px-6 sm:py-5">
      <div className="mt-4 text-sm text-gray-900 ">
        {notificationOnlineMemberIds.length === 0 ? (
          <div className="bg-yellow-50 text-sm text-yellow-700 rounded p-4">
            {t('missing_online_notifications1')}
            <BellIcon className="h-4 w-4 text-yellow-600 inline-block" />
            {t('missing_online_notifications2')}
          </div>
        ) : (
          <div className="border border-gray-200 rounded">
            <table className="min-w-full">
              <tbody className="divide-y divide-gray-200">
                {formatUserBasicInfo(users).map((user, index) => {
                  return (
                    <MemberInfo
                      key={`notification-member-${user.userId}`}
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
        onClose={() => {
          setRemoveDialogOpenState(false);
        }}
        onOk={() => {
          if (removeUser) {
            removeNotificationOnlineMemberFromUserId(removeUser.userId).then((res) => {
              setRemoveUser(undefined);
              reloadNotificationOnlineMemberIds();
              setRemoveDialogOpenState(false);
              setRemovedToastOpenState(true);
            });

            setTimeout(() => {
              setRemovedToastOpenState(false);
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
