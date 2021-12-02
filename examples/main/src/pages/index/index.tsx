import React, { FC, ReactNode, useCallback, useState, useEffect } from 'react';
import { Row, Col } from 'antd';
import { observer } from 'mobx-react-lite';

// types
import { History } from 'history';
import { match } from 'react-router';

// utils
import { TenonContainer, globalState } from '../../../../../src';

import './index.less';

import { indexConfig } from '@/setting';

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
export const IndexPage: FC = observer((props: Props) => {
  const [config, setConfig] = useState<Record<string, string>>();

  useEffect(() => {

    // fetchConfig();
    setConfig(indexConfig.value);

    setTimeout(() => {
      globalState.set({
        userInfo: {
          headImage: null,
          userName: 'MSX.Pan',
          positionName: 'Front-end Engineer',
          orgName: '',
        },
      });
    }, 1500);
  }, [indexConfig.value]);

  /**
   * 栅格内容 Render
   */
  const colRender = useCallback((colList) => {
    return colList.map((item) => {
      return (
        <Col key={item.key} span={item.span}>
          {item.col ? (
            <Row gutter={item.gutter || [18, 18]} style={{ height: '100%' }}>
              {colRender(item.col)}
            </Row>
          ) : item.blocks ? (
            item.blocks.map((block) => {
              if (block.import) {
                return (
                  <TenonContainer
                    // key={item.key}
                    key={`${block.key} - ${block.import}`}
                    block={block}
                    style={{
                      ...item.style,
                    }}
                    data={{
                      ...block.props,
                    }}
                    mode={__DEVTOOL ? 'development' : 'production'}
                  />
                );
              } else {
                return <div className="block-container"> - </div>;
              }
            })
          ) : (
            <div className="block-container"> - </div>
          )}
        </Col>
      );
    });
  }, []);

  return (
    <div className="container">
      <Row gutter={[18, 18]}>{colRender(config?.col || [])}</Row>
    </div>
  );
});
