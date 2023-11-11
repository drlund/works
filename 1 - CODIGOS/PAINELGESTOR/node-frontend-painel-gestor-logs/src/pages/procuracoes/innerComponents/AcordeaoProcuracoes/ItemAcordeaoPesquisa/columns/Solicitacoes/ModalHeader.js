import { Col, Row } from 'antd';
import React from 'react';

export function ModalHeader() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={10} style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
        Procuração Referente
      </Col>
      <Col span={7} style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold' }}>
        <div>Certidão de Procuração</div>
        <div style={{ color: 'gray', fontSize: '0.8em' }}>
          (Último pedido de certidão, se existente)
        </div>
      </Col>
      <Col span={7} style={{ textAlign: 'center', fontSize: '1.2em', fontWeight: 'bold' }}>
        <div>Cópia Autenticada</div>
        <div style={{ color: 'gray', fontSize: '0.8em' }}>
          (Último pedido de copia, se existente)
        </div>
      </Col>
    </Row>
  );
}
