import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon, ClipboardIcon, CheckIcon, QrcodeIcon } from '@heroicons/react/outline';
import { LockClosedIcon, LockOpenIcon, ExclamationCircleIcon } from '@heroicons/react/solid';

import QRCode from 'react-qr-code';

import { useTranslation } from '../../lib/i18n';

interface Props {
  isOpen: boolean;
  onClose: Function;
}

const selectStyle =
  'w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500';
const unselectStyle = 'w-full inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md bg-gray-0 hover:bg-gray-100';

const Component: React.FC<Props> = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();

  const roomNameInputRef = useRef(null);

  const [roomNameState, setRoomNameState] = useState<string>('');
  const [isCopiedState, setIsCopiedState] = useState<boolean>(false);
  const [passwordRequiredState, setPasswordRequiredState] = useState<boolean>(false);
  const [isValidRoomNameState, setIsValidRoomNameState] = useState<boolean>(false);
  const [urlState, setUrlState] = useState<string>('');

  useEffect(() => {
    setUrlState(
      `https://webapi.syncroom.appservice.yamaha.com/ndroom/launch_app?roomName=${encodeURIComponent(roomNameState)}&requirePassword=${passwordRequiredState ? '1' : '0'}`
    );
  }, [roomNameState, passwordRequiredState]);

  useEffect(() => {
    setIsValidRoomNameState(roomNameState.length !== 0);
  }, [roomNameState]);

  let copyTimer: ReturnType<typeof setTimeout>;

  const onCopyUrl = () => {
    navigator.clipboard.writeText(urlState);

    setIsCopiedState(true);

    clearTimeout(copyTimer);

    copyTimer = setTimeout(() => {
      if (setIsCopiedState) {
        setIsCopiedState(false);
      }
    }, 3000);
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        initialFocus={roomNameInputRef}
        onClose={() => {
          onClose();
        }}
      >
        <div className="flex items-end min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-800 bg-opacity-80 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg w-full sm:p-6">
              <div className="bg-white border-b border-gray-200 pb-2">
                <p className="text-lg leading-6 font-medium text-gray-900 inline-flex">
                  <QrcodeIcon className="block h-5 w-5 mr-2" />
                  {t('share_room')}
                </p>
              </div>

              <div className="my-6">
                <label htmlFor="roomname" className="block text-sm font-medium text-gray-700">
                  {t('room_name')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="roomname"
                    id="roomname"
                    className={
                      isValidRoomNameState
                        ? 'block w-full pr-10 border-green-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md'
                        : 'block w-full pr-10 border-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md'
                    }
                    placeholder={t('room_name')}
                    ref={roomNameInputRef}
                    value={roomNameState}
                    onChange={(e) => {
                      setRoomNameState(e.target.value);
                    }}
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {isValidRoomNameState ? <CheckIcon className="h-5 w-5 text-green-500" /> : <ExclamationCircleIcon className="h-5 w-5 text-red-500" />}
                  </div>
                </div>
                {!isValidRoomNameState && (
                  <p className="mt-2 text-sm text-red-600" id="roomname-error">
                    {t('empty_room_name_message')}
                  </p>
                )}

                <label className="block text-sm font-medium text-gray-700 mt-4">{t('password')}</label>
                <div className="mt-1 relative">
                  <div className="flex justify-between">
                    <button
                      type="button"
                      className={`${passwordRequiredState ? unselectStyle : selectStyle} mr-2`}
                      onClick={() => {
                        setPasswordRequiredState(false);
                      }}
                    >
                      <LockOpenIcon className="h-5 w-5 mr-2" />
                      {t('password_disabled')}
                    </button>
                    <button
                      type="submit"
                      className={`${passwordRequiredState ? selectStyle : unselectStyle}`}
                      onClick={() => {
                        setPasswordRequiredState(true);
                      }}
                    >
                      <LockClosedIcon className="h-5 w-5 mr-2" />
                      {t('password_enabled')}
                    </button>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-center bg-gray-400 p-6 rounded">
                  <div className="rounded bg-white p-6">
                    <QRCode value={urlState} level="L" size={150} />
                  </div>
                </div>

                <div className="mt-2 flex rounded-md shadow-sm">
                  <div className="relative flex items-stretch flex-grow focus-within:z-10">
                    <input
                      type="url"
                      name="url"
                      className="focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      value={urlState}
                      disabled
                    />
                  </div>
                  <button
                    type="button"
                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                    onClick={onCopyUrl}
                  >
                    {isCopiedState ? (
                      <>
                        <CheckIcon className="h-5 w-5 text-green-400" />
                        <span>{t('copied_link')}</span>
                      </>
                    ) : (
                      <>
                        <ClipboardIcon className="h-5 w-5 text-gray-400" />
                        <span>{t('copy_link')}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-5 border-t border-gray-200 pt-4">
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
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default React.memo(Component);
