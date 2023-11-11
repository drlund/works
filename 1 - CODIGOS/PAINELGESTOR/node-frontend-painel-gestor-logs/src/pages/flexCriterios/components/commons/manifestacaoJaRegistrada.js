import React from 'react';
import { Card, Typography } from 'antd';

export default function ManifestacaoJaRegistrada({ titulo }) {
  return (
    <Card title={titulo}>
      <div style={{ minHeight: 500 }}>
        <Typography.Text strong>{`${titulo} já registrada`}</Typography.Text>
      </div>
    </Card>
  );
}
