import { Card, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

const { Text } = Typography;

/**
 * @param {{
 *  title: import('react').ReactNode,
 *  extraButton?: import('react').ReactNode
 *  children: import('react').ReactNode
 * }} props
 */
export const CampoInformacao = ({ title, children, extraButton = null }) => (
  <Card
    type="inner"
    title={(
      <Text type="secondary" strong>
        {title}
      </Text>
    )}
    extra={extraButton}
    style={{ minWidth: '70%', width: 'max-content', maxWidth: '100%' }}
  >
    <CardCampoContent>{children}</CardCampoContent>
  </Card>
);

const CardCampoContent = styled.div`
  min-height: 80px;
  display: flex;
  justify-content: center;
  flex-flow: column;
`;
