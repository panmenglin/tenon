import React, { FC, useState, useCallback, useEffect } from 'react';
import { Drawer, Button, Input, Alert, Space, Row, Col } from 'antd';
const { TextArea } = Input;
import { SettingOutlined } from '@ant-design/icons';
import { useDebounceFn } from 'ahooks';
import localForage from 'localforage';

import { Config } from '@/pages/index/mock';

import { setter } from 'mobx-value';

export const indexConfig = setter({ value: {} });

export const formatJson = (
  jsonStr: string
): {
  formatJSON: string;
  error?: string;
} => {
  try {
    JSON.parse(jsonStr, (key, value) => {
      return value;
    });
  } catch (error) {
    return {
      formatJSON: jsonStr,
      error,
    };
  }

  const str = eval('(' + jsonStr + ')');
  const formatJSON = JSON.stringify(str, null, 4);

  return {
    formatJSON,
  };
};

export const Setting: FC = () => {
  const [visible, setVisible] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const fetchConfig = useCallback(async () => {
    const config = (await localForage.getItem('indexConfig')) || Config;
    const { formatJSON, error } = formatJson(JSON.stringify(config));
    setCode(formatJSON);

    const confg = JSON.parse(formatJSON);
    indexConfig.set(confg);
  }, []);

  useEffect(() => {
    fetchConfig()
  }, []);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  const { run, cancel } = useDebounceFn(
    (code) => {
      const { formatJSON, error } = formatJson(code);
      setCode(formatJSON);
      setError(`${error || ''}`);
    },
    {
      wait: 1000,
    }
  );

  const onSave = useCallback(() => {
    const { formatJSON, error } = formatJson(code);

    if (!error) {
      const confg = JSON.parse(formatJSON);
      localForage.setItem('indexConfig', confg);
      indexConfig.set(confg);
    }
  }, [code]);

  const onReset = useCallback(() => {
    const { formatJSON, error } = formatJson(JSON.stringify(Config));
    setCode(formatJSON);
  }, []);

  return (
    <>
      <Button
        onClick={showDrawer}
        type="primary"
        style={{
          width: '32px',
          textAlign: 'center',
          padding: '0',
          position: 'fixed',
          top: '200px',
          right: '0',
        }}
      >
        <SettingOutlined />
      </Button>
      <Drawer
        title="业务单元配置"
        placement="right"
        onClose={onClose}
        visible={visible}
        width={500}
        extra={
          <Space>
            <Button onClick={onReset}>重置</Button>
            <Button type="primary" onClick={onSave}>
              保存
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <TextArea
              value={code}
              rows={10}
              autoSize={{ minRows: 20 }}
              onChange={(e) => {
                setCode(e.currentTarget.value);
                run(e.currentTarget.value);
              }}
            />
          </Col>
          {error ? (
            <Col span={24}>
              <Alert message={error} type="error" showIcon />
            </Col>
          ) : null}
        </Row>
      </Drawer>
    </>
  );
};
