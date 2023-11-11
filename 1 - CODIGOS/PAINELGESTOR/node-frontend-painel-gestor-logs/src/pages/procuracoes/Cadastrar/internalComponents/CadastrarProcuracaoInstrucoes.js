import { Col, Typography } from 'antd';
import CardSecao from 'components/CardSecao';
import React from 'react';

export function CadastrarProcuracaoInstrucoes() {
  return (
    <Col span={24}>
      <CardSecao title="Cadastrar Procuração">
        <Typography.Paragraph>
          Para cadastrar uma procuração, primeiro selecione um fluxo abaixo ou continue o cadastro a partir de uma minuta emitida.
        </Typography.Paragraph>
      </CardSecao>
    </Col>
  );
}
