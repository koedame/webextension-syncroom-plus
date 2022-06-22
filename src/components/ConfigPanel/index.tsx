import React, { Fragment, memo, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import Basic from './BasicConfig';
import Favorites from './FavoritesMembers';
import OnlineNotifications from './OnlineNotifications';

import { useTranslation } from '../../lib/i18n';
import { useNotificationOnlineMemberIds } from '../../hooks/useNotificationOnlineMembers';
import { useSession } from '../../hooks/useSession';
import BlockMembers from './BlockMembers';
import { useLoginRequired } from '../LoginRequired/Dialog';

function classNames(...classes: any) {
  return classes.filter(Boolean).join(' ');
}

interface Props {
  isOpen: boolean;
  onClose: Function;
}

const Component: React.FC<Props> = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();

  const { myProfile, reloadMyProfile, isLoggedIn } = useSession();
  const { notificationOnlineMemberIds } = useNotificationOnlineMemberIds();
  const LoginRequired = useLoginRequired();
  const [currentTabState, setCurrentTabState] = useState<'basic' | 'favorite' | 'block' | 'online_notification'>('basic');

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-20 overflow-hidden"
        onClose={() => {
          onClose();
        }}
      >
        <div className="absolute inset-0 overflow-hidden">
          <Dialog.Overlay className="absolute inset-0 bg-gray-800 bg-opacity-80 transition-opacity" />

          <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex sm:pl-16">
            <Transition.Child
              as={Fragment}
              enter="transform transition ease-in-out duration-500 sm:duration-500"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-500 sm:duration-500"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <div className="w-screen max-w-2xl">
                <div className="h-full flex flex-col bg-white shadow-xl overflow-y-scroll">
                  <div className="px-4 py-6 sm:px-6 bg-gray-100">
                    <div className="flex items-start justify-between">
                      <Dialog.Title className="text-lg font-medium text-gray-900">{t('menu')}</Dialog.Title>
                      <div className="ml-3 h-7 flex items-center">
                        <button
                          type="button"
                          className="rounded-md text-gray-400 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500"
                          onClick={() => {
                            onClose();
                          }}
                        >
                          <XIcon className="h-6 w-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {/* Main */}
                  <div className="divide-y divide-gray-200">
                    <div>
                      <div className="border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8 px-6">
                          <button
                            onClick={() => {
                              setCurrentTabState('basic');
                            }}
                            className={classNames(
                              'basic' === currentTabState ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            )}
                          >
                            {t('basic_settings')}
                          </button>
                          <button
                            onClick={() => {
                              if (!isLoggedIn) {
                                return LoginRequired.openLoginRequiredDialog();
                              }
                              setCurrentTabState('favorite');
                            }}
                            className={classNames(
                              'favorite' === currentTabState ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            )}
                          >
                            {t('manage_favorites', { length: myProfile?.favoriteUsers.length || 0 })}
                          </button>
                          <button
                            onClick={() => {
                              if (!isLoggedIn) {
                                return LoginRequired.openLoginRequiredDialog();
                              }
                              setCurrentTabState('online_notification');
                            }}
                            className={classNames(
                              'online_notification' === currentTabState
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            )}
                          >
                            {t('manage_online_notifications', { length: notificationOnlineMemberIds.length })}
                          </button>
                          <button
                            onClick={() => {
                              if (!isLoggedIn) {
                                return LoginRequired.openLoginRequiredDialog();
                              }
                              setCurrentTabState('block');
                            }}
                            className={classNames(
                              'block' === currentTabState ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
                              'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm'
                            )}
                          >
                            {t('manage_blocks', { length: myProfile?.blockedUsers.length || 0 })}
                          </button>
                        </nav>
                      </div>
                    </div>

                    <div className="px-4 py-5 sm:px-0 sm:py-0">
                      <div className="space-y-8 sm:divide-y sm:divide-gray-200 sm:space-y-0">
                        {currentTabState === 'basic' && <Basic />}
                        {currentTabState === 'favorite' && <Favorites />}
                        {currentTabState === 'block' && <BlockMembers />}
                        {currentTabState === 'online_notification' && <OnlineNotifications />}
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-gray-200 py-4 px-4">
                    <button
                      type="button"
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                      onClick={() => {
                        onClose();
                      }}
                    >
                      <XIcon className="h-5 w-5 mr-2" />
                      {t('close')}
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default memo(Component);
