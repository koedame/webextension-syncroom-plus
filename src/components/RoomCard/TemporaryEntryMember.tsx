import React from 'react';

import { useTranslation } from '../../lib/i18n';

interface Props {
  memberName: string;
}

const Component: React.FC<Props> = ({ memberName }: Props) => {
  const { t } = useTranslation();

  return (
    <div className="flex w-full p-1">
      <img className="rounded w-8 h-8 mr-2" src="https://syncroomplus.koeda.me/images/members/unknown.png" alt={memberName} />
      <div className="flex justify-between items-center w-full mr-1">
        <p className="truncate inline-block text-xs max-w-[185px]">{t('temporary_entry')}</p>
      </div>
    </div>
  );
};

export default React.memo(Component);
