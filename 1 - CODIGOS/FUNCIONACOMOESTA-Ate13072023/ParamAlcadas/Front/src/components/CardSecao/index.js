import React from 'react';
import { Card, Typography } from 'antd';

/**
 * @param {{
 *  title: string;
 *  children: React.ReactNode;
 * } & React.ComponentProps<Card>} props
 */
function CardSecao({ title, children, ...rest }) {
  return (
    <Card
      title={<Typography.Title level={2}>{title}</Typography.Title>}
      {...rest}
    >
      <div>{children}</div>
    </Card>
  );
}

export default CardSecao;
