import React from 'react';

interface Props {
  remaining_time: string;
}

const Component: React.VFC<Props> = ({ remaining_time }: Props) => {
  return (
    <>
      <div>
        <div className="w-6"></div>
      </div>
      <div className="text-sm">{remaining_time}</div>
      <div className="w-6"></div>
    </>
  );
};

export default React.memo(Component);
