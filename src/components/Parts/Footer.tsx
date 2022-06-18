import React from 'react';

import { useTranslation } from '../../lib/i18n';

interface Props {
  version: string;
}

const Component: React.FC<Props> = ({ version }: Props) => {
  const { t } = useTranslation();

  return (
    <footer className="bg-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <p className="bg-gray-600 text-white rounded py-1 px-2">SYNCROOM Plus Version {version}</p>
        </div>
        <p className="mt-8 text-center text-base text-gray-400">
          {t('developed_by')}
          <a className="hover:text-gray-200" href="https://twitter.com/koedamedev" target="_blank" rel="noopener noreferrer">
            <strong>肥溜め</strong>@koedamedev
          </a>
        </p>
      </div>
    </footer>
  );
};

export default React.memo(Component);
