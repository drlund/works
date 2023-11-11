import React from 'react';
import { Col, Row } from 'antd';
import Solicitacao from 'pages/designacao/Pendencias/Solicitacao';
import Historico from 'pages/designacao/Pendencias/Historico';

export default React.memo(function SolicHist(props) {
  return (
    <Row>
      <Col span={12}><Solicitacao solicitacao={props.id} /></Col>
      <Col span={12}><Historico id={props.id} mode='left' /></Col>
    </Row>
  )
})