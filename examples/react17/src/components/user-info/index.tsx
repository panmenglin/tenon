import React, { FC, ReactNode, useState, useEffect } from 'react';
import { Divider } from 'antd';

import userface from '@/assets/images/photo_default_2x.png';

import './index.less';

export type Props = {
  onGlobalStateChange: (callback, changeKeys: string[]) => void;
  getGlobalState: () => Record<string, any>;
  children?: ReactNode;
};

export const UserInfo: FC = (props: Props) => {
  const { onGlobalStateChange, getGlobalState } = props;

  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    const globalState = getGlobalState ? getGlobalState() : {};
    const { userInfo: _userInfo } = globalState;
    setUserInfo(_userInfo);

    if (onGlobalStateChange) {
      onGlobalStateChange(
        (state, prev) => {
          if (state.userInfo) {
            setUserInfo(state.userInfo);
          }
        },
        ['userInfo'],
      );
    }
  }, []);

  return (
    <div className="user-info-block">
      <div className="user-info-userface">
        <img src={userInfo?.headImage || userface} alt="" />
      </div>
      <div>
        <div className="user-info-title">
          {userInfo?.userName}
        </div>
        <div className="user-info-info">
          {userInfo?.positionName || '-'}
          <Divider type="vertical" />
          {userInfo?.orgName}
        </div>
      </div>
    </div>
  );
};
