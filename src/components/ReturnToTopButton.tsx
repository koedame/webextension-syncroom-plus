import React, { useEffect, useState } from 'react';

import { useTranslation } from '../lib/i18n';
import { ArrowUpIcon } from '@heroicons/react/outline';
import { Transition } from '@headlessui/react';

interface Props {}

const Component: React.FC<Props> = ({}: Props) => {
  const { t } = useTranslation();

  const [isShow, setIsShow] = useState<boolean>(false);

  let scrollTimer: any = null;
  const showControll = () => {
    if (scrollTimer) {
      return false;
    } else {
      scrollTimer = setTimeout(() => {
        scrollTimer = null;
        console.log('hoge');
        if (window.pageYOffset > 200) {
          setIsShow(true);
        } else {
          setIsShow(false);
        }
      }, 500);
    }
  };

  useEffect(() => {
    const watchScroll = () => {
      window.addEventListener('scroll', showControll);
    };

    watchScroll();

    return () => {
      window.removeEventListener('scroll', showControll);
    };
  });

  return (
    <Transition
      show={isShow}
      enter="transition-opacity duration-500"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-500"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed left-1/2 bottom-0 pb-4 pr-4 transform -translate-x-1/2">
        <button
          onClick={() => {
            window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center py-2 px-4 font-medium rounded-md bg-gray-600 hover:bg-gray-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-base"
        >
          <ArrowUpIcon className="block h-5 w-5 mr-2" />
          {t('return_to_top')}
        </button>
      </div>
    </Transition>
  );
};

export default React.memo(Component);
