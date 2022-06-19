import React, { useState } from 'react';
import ReportButton from './ReportButton';
import ReportForm from './ReportForm';

interface Props {}

const Component: React.FC<Props> = ({}: Props) => {
  const [isOpenReportForm, setIsOpenReportForm] = useState<boolean>(false);

  return (
    <>
      <ReportButton
        setIsOpen={() => {
          setIsOpenReportForm(true);
        }}
      />
      <ReportForm
        isOpen={isOpenReportForm}
        onClose={() => {
          setIsOpenReportForm(false);
        }}
      />
    </>
  );
};

export default React.memo(Component);
