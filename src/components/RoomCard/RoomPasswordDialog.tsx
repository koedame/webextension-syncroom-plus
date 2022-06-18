import React, { Fragment, useRef, useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/outline';

import { useTranslation } from '../../lib/i18n';
import { useConfigRememberPassword } from '../../hooks/useConfigRememberPasswordState';
import { useRoomPasswordPrompt } from '../../hooks/useRoomPasswordPrompt';
import { useRememberPassword } from '../../hooks/useRememberPassword';
import { openInSyncroomApp } from '../../lib/openInSyncroomApp';

interface Props {
  isOpen: boolean;
  onClose: Function;
  onOk: Function;
}

const Component: React.FC<Props> = ({ isOpen, onClose, onOk }: Props) => {
  const { t } = useTranslation();

  const { currentRoomName } = useRoomPasswordPrompt();
  const { getRememberPasswordsByRoomName, saveRoomPassword } = useRememberPassword();

  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [roomPasswordState, setRoomPasswordState] = useState<string>('');
  const [isValidRoomPasswordState, setIsValidRoomPasswordState] = useState<boolean>(false);

  const { configRememberPassword } = useConfigRememberPassword();

  useEffect(() => {
    setIsValidRoomPasswordState(roomPasswordState.length !== 0);
  }, [roomPasswordState]);

  useEffect(() => {
    if (configRememberPassword) {
      setRoomPasswordState(getRememberPasswordsByRoomName(currentRoomName));
    } else {
      setRoomPasswordState('');
    }
  }, [currentRoomName]);

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={passwordInputRef}
        onClose={() => {
          onClose();
        }}
      >
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
              <div>
                <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900 border-b border-gray-200 pb-2">
                  {t('please_enter_room_password')}
                </Dialog.Title>

                <div className="my-4">
                  <label htmlFor="roomname" className="block text-sm font-medium text-gray-700">
                    {t('room_name')}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="roomname"
                      id="roomname"
                      className="block w-full pr-10 bg-gray-100 border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
                      disabled
                      value={currentRoomName}
                    />
                  </div>
                </div>
                <div className="my-4">
                  <label htmlFor="roompassword" className="block text-sm font-medium text-gray-700">
                    {t('password')}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <input
                      type="text"
                      name="roompassword"
                      id="roompassword"
                      className={
                        isValidRoomPasswordState
                          ? 'block w-full pr-10 border-green-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
                          : 'block w-full pr-10 border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md'
                      }
                      placeholder={t('password')}
                      ref={passwordInputRef}
                      value={roomPasswordState}
                      onChange={(e) => {
                        setRoomPasswordState(e.target.value);
                      }}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      {isValidRoomPasswordState ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ExclamationCircleIcon className="h-5 w-5 text-red-500" />}
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:mt-6 flex space-x-4">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                  onClick={() => {
                    onClose();
                  }}
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:col-start-2 sm:text-sm"
                  onClick={() => {
                    if (isValidRoomPasswordState) {
                      if (configRememberPassword) {
                        saveRoomPassword(currentRoomName, roomPasswordState);
                      }
                      openInSyncroomApp(currentRoomName, roomPasswordState, true);
                      onClose();
                    } else {
                      passwordInputRef.current?.focus();
                    }
                  }}
                >
                  {t('temporary_entry')}
                </button>
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
                  onClick={() => {
                    if (isValidRoomPasswordState) {
                      if (configRememberPassword) {
                        saveRoomPassword(currentRoomName, roomPasswordState);
                      }
                      openInSyncroomApp(currentRoomName, roomPasswordState, true);
                      onClose();
                    } else {
                      passwordInputRef.current?.focus();
                    }
                  }}
                >
                  {t('join')}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default React.memo(Component);
