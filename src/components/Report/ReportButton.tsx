import React, { useState } from 'react';
import { ExclamationIcon } from '@heroicons/react/solid';

import { useTranslation } from '../../lib/i18n';

interface Props {
  setIsOpen: Function;
}

const Component: React.FC<Props> = ({ setIsOpen }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="fixed right-0 bottom-0 pb-4 pr-4">
      <button
        onClick={() => {
          setIsOpen(true);
        }}
        className="inline-flex items-center py-2 px-4 font-medium rounded-md bg-yellow-600 hover:bg-yellow-700 text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 text-base"
      >
        <ExclamationIcon className="block h-5 w-5 mr-2" />
        {t('reports')}
      </button>
    </div>
  );
};

export default React.memo(Component);
