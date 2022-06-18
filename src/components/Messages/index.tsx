import React, { memo } from 'react';
import LoginMessage from './LoginMessage';
import ServiceNotification from './ServiceNotification';

interface Props {}

const Component: React.VFC<Props> = ({}: Props) => {
  return (
    <>
      <ServiceNotification />
      <LoginMessage />
    </>
  );
};

export default memo(Component);
