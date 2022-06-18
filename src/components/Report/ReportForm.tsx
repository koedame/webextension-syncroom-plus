import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XIcon } from '@heroicons/react/outline';

import { useTranslation } from '../../lib/i18n';

interface Props {
  isOpen: boolean;
  onClose: Function;
}

const Component: React.FC<Props> = ({ isOpen, onClose }: Props) => {
  const { t } = useTranslation();

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed z-10 inset-0 overflow-y-auto"
        onClose={() => {
          onClose();
        }}
      >
        <div className="flex items-center justify-center py-10 px-20  text-center h-screen">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:align-middle w-5/6 h-5/6">
              <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
                <button
                  type="button"
                  className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => onClose()}
                >
                  <XIcon className="h-6 w-6" />
                </button>
              </div>
              <iframe
                className="w-full h-full"
                src="https://docs.google.com/forms/d/e/1FAIpQLSeGXG8E9_dEfy1vEKV8DdZ5RGNSVIKQOh_3yenXWTGPJRpRmA/viewform?embedded=true"
                frameBorder="0"
                marginHeight={0}
                marginWidth={0}
              >
                {t('loading')}
              </iframe>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default React.memo(Component);
