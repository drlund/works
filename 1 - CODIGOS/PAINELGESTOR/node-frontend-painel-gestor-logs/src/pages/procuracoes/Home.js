import { Col, Row } from 'antd';
import React from 'react';
import Funcionalidades from './Home/Funcionalidades';
import Instrucoes from './Home/Instrucoes';

function Home() {
  return (
    <Row gutter={[0, 15]}>
      <Col span={24}>
        <Instrucoes />
      </Col>
      <Col span={24}>
        <Funcionalidades />
      </Col>
    </Row>
  );
}

export default Home;
