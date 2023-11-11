import { Col, Typography } from 'antd';
import CardSecao from 'components/CardSecao';
import React from 'react';

export function InstrucoesMinutas() {
  return (
    <Col span={24}>
      <CardSecao title="Minutas">
        <Typography.Paragraph>
          Minuta é o modelo utilizado para solicitar ao cartório a emissão de uma procuração.
          Para mais informações, consulte a IN 288-1.
        </Typography.Paragraph>
        <Typography.Paragraph>
          Ao emitir uma minuta utilizando esta ferramenta,
          você também poderá reutilizar os dados preenchidos
          para finalizar o cadastramento da procuração.
        </Typography.Paragraph>
      </CardSecao>
    </Col>
  );
}
