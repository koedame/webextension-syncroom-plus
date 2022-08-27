import React, { Fragment, useState } from 'react';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { CheckIcon, Bars3Icon, ChevronDownIcon, LanguageIcon, QrCodeIcon, XMarkIcon, ArrowLeftOnRectangleIcon, UserIcon } from '@heroicons/react/24/outline';

import { useTranslation, langMap, changeLanguage } from '../../lib/i18n';

import ShareRoom from '../ShareRoom';
import ConfigPanel from '../ConfigPanel/index';
import { useSession } from '../../hooks/useSession';
import { iconInfoToUrl } from '../../lib/iconInfoToUrl';
import { useUserSearch } from '../SearchMember';
import { useMyProfile } from '../MyProfile';
import { useLoginRequired } from '../LoginRequired/Dialog';

interface Props {}

const Component: React.FC<Props> = ({}: Props) => {
  const [shareRoomOpenState, setShareRoomOpenState] = useState<boolean>(false);
  const [configPanelOpenState, setConfigPanelOpenState] = useState<boolean>(false);

  const { myProfile, logout, isLoggedIn } = useSession();

  const { t, i18n } = useTranslation();

  const { openMyProfileForm } = useMyProfile();
  const { openUserSearchForm } = useUserSearch();

  const { openLoginRequiredDialog } = useLoginRequired();

  const displayLangState = langMap(i18n.language);

  return (
    <Disclosure as="nav" className="bg-white sticky top-0 z-10">
      {({ open }) => (
        <>
          <div className="mx-auto px-4">
            <div className="relative flex justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button */}
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                  {open ? <XMarkIcon className="block h-6 w-6" /> : <Bars3Icon className="block h-6 w-6" />}
                </Disclosure.Button>
                <img className="block h-8 w-auto" src="https://syncroomplus.koeda.me/images/logo.png" alt="Workflow" />
              </div>
              <div className="flex-1 flex items-center justify-center sm:justify-start">
                <div className="flex-shrink-0 flex items-center">
                  <img className="hidden lg:hidden h-8 w-auto sm:block" src="https://syncroomplus.koeda.me/images/logo.png" alt="Workflow" />
                  <img className="hidden lg:block h-8 w-auto" src="https://syncroomplus.koeda.me/images/logo.png" alt="Workflow" />
                </div>
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {/* Current: "border-indigo-500 text-gray-900", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-900" */}
                  <button
                    onClick={() => {
                      setShareRoomOpenState(true);
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    <QrCodeIcon className="block h-5 w-5 mr-2" />
                    {t('share_room')}
                  </button>

                  <button
                    onClick={(event) => {
                      // ログイン必須
                      if (!isLoggedIn) {
                        event.preventDefault();
                        return openLoginRequiredDialog();
                      }
                      openUserSearchForm();
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <UserIcon className="block h-5 w-5 mr-2" />
                    {t('user_search')}
                  </button>
                </div>
              </div>

              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <Menu as="div" className="ml-3 relative">
                  <div>
                    <Menu.Button className=" inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                      <LanguageIcon className="block h-5 w-5 mr-2" />
                      Language: {displayLangState}
                      <ChevronDownIcon className="block h-5 w-5 ml-2" />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-200"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className=" origin-top-right absolute right-0 mt-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        <button
                          onClick={() => {
                            changeLanguage('en');
                          }}
                          className={`w-full px-4 py-2 text-sm text-gray-900 hover:w-full hover:bg-gray-100 ${i18n.language === 'en' ? 'text-indigo-600' : ''}`}
                        >
                          {i18n.language === 'en' && <CheckIcon className="inline h-5 w-5 mr-1" />}
                          English
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          onClick={() => {
                            changeLanguage('ja');
                          }}
                          className={`w-full px-4 py-2 text-sm text-gray-900 hover:w-full hover:bg-gray-100 ${i18n.language === 'ja' ? 'text-indigo-600' : ''}`}
                        >
                          {i18n.language === 'ja' && <CheckIcon className="inline h-5 w-5 mr-1" />}
                          Japanese (日本語)
                        </button>
                      </Menu.Item>
                      <Menu.Item>
                        <button
                          onClick={() => {
                            changeLanguage('ko');
                          }}
                          className={`w-full px-4 py-2 text-sm text-gray-900 hover:w-full hover:bg-gray-100 ${i18n.language === 'ko' ? 'text-indigo-600' : ''}`}
                        >
                          {i18n.language === 'ko' && <CheckIcon className="inline h-5 w-5 mr-1" />}
                          Korean (한국어)
                        </button>
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>

                <button
                  onClick={() => {
                    setConfigPanelOpenState(true);
                  }}
                  className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Bars3Icon className="block h-5 w-5 mr-2" />
                  {t('menu')}
                </button>

                {myProfile ? (
                  <Menu as="div" className="ml-3 relative">
                    <div>
                      <Menu.Button className=" inline-flex items-center px-4 py-2 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <img className="block h-8 w-8 mr-2 border border-gray-200 rounded-md" src={iconInfoToUrl(myProfile.iconInfo)} />
                        <p className="max-w-[100px] truncate">{myProfile.nickname}</p>
                        <ChevronDownIcon className="block h-5 w-5 ml-2" />
                      </Menu.Button>
                    </div>
                    <Transition
                      as={Fragment}
                      enter="transition ease-out duration-200"
                      enterFrom="transform opacity-0 scale-95"
                      enterTo="transform opacity-100 scale-100"
                      leave="transition ease-in duration-75"
                      leaveFrom="transform opacity-100 scale-100"
                      leaveTo="transform opacity-0 scale-95"
                    >
                      <Menu.Items className="origin-top-right absolute right-0 mt-2 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none w-[230px] divide-y divide-gray-100">
                        <div>
                          <Menu.Item>
                            <a
                              href="https://syncroom.yamaha.com/mypage"
                              className="block w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 text-left"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('account_page')}
                            </a>
                          </Menu.Item>

                          <Menu.Item>
                            <a
                              href={`https://syncroom.yamaha.com/mypage/user/${myProfile.userId}`}
                              className="block w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 text-left"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {t('my_profile')}
                            </a>
                          </Menu.Item>

                          <Menu.Item>
                            <button
                              className="block w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 text-left"
                              onClick={(event) => {
                                // ログイン必須
                                if (!isLoggedIn) {
                                  event.preventDefault();
                                  return openLoginRequiredDialog();
                                }
                                openMyProfileForm();
                              }}
                            >
                              {t('edit_my_profile')}
                            </button>
                          </Menu.Item>
                        </div>

                        <div>
                          <Menu.Item>
                            <button
                              onClick={() => {
                                logout();
                              }}
                              className="block w-full px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 text-left"
                            >
                              {t('logout')}
                            </button>
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </Menu>
                ) : (
                  <a
                    href="https://webapi.syncroom.appservice.yamaha.com/comm/static/login.html"
                    className="ml-6 inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md shadow-sm text-indigo-600 hover:text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <ArrowLeftOnRectangleIcon className="block h-5 w-5 mr-2" />
                    {t('login')}
                  </a>
                )}
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-4 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setShareRoomOpenState(true);
                }}
                className="flex w-full border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-900 block pl-3 pr-4 py-2 border-l-4 text-base font-medium"
              >
                <QrCodeIcon className="block h-5 w-5 mr-2" />
                {t('share_room')}
              </button>
            </div>
          </Disclosure.Panel>

          <ShareRoom
            isOpen={shareRoomOpenState}
            onClose={() => {
              setShareRoomOpenState(false);
            }}
          />
          <ConfigPanel
            isOpen={configPanelOpenState}
            onClose={() => {
              setConfigPanelOpenState(false);
            }}
          />
        </>
      )}
    </Disclosure>
  );
};

export default React.memo(Component);
