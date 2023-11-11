import { UserOutlined } from '@ant-design/icons';
import { Space, Typography } from 'antd';
import React from 'react';

const { Text } = Typography;

/**
 * @param {{ fluxoUtilizado: string }} props
 */
export function DisplayFluxoEscolhido({ fluxoUtilizado }) {
  return (
    <Space>
      <UserOutlined style={{ fontSize: 25 }} />
      <Text>{fluxoUtilizado}</Text>
    </Space>
  );
}
