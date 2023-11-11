import React from "react";
import { Row, Col, Button } from "antd";
import IncluirMonitoramento from "./Monitoramentos/IncluirMonitoramento";

const Monitoramentos = (props) => {
  return (
    <Row gutter={[0, 20]}>
      <Col span={24}>
        <IncluirMonitoramento />
      </Col>
      <Col span={24}>Tabela de monitoramentos</Col>
    </Row>
  );
};

export default Monitoramentos;
