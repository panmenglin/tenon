import React, { FC, ReactNode } from 'react';
import { Row, Col } from 'antd';

// types
import { History } from 'history';
import { match } from 'react-router';

import { UserInfo } from '@/components/user-info';
import { LineChart } from '@/components/line-chart';

import './index.less';

type Props = {
  history: History;
  location: Location;
  match: match;
  children?: ReactNode;
};

/**
 * 工作台
 * @returns
 */
export const Demo: FC = (props: Props) => {
  return (
    <div className="container">
      <Row gutter={[46, 16]}>
        <Col span={24}>
          <UserInfo {...props}></UserInfo>
        </Col>
        <Col span={24}>
          <LineChart></LineChart>
        </Col>
      </Row>
    </div>
  );
};
