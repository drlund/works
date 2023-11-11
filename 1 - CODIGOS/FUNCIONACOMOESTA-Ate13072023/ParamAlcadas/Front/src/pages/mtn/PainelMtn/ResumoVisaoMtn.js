import React from "react";
import { Col, Row, Statistic } from "antd";

const style = {
  display: "flex",
  alignContent: "center",
  justifyContent: "center",
  textAlign: "center",
};

const ResumoVisaoMtn = (props) => {
  return (
    <Row gutter={[0,16]} justify="center" align="middle">
      <Col span={8} style={style}>
        <Statistic title="Total" value={props.total} />
      </Col>
      <Col span={8} style={style}>
        <Statistic
          title="Pendentes"
          value={props.resumo ? props.resumo.pendentes : 0}
        />
      </Col>
      <Col span={8} style={style}>
        <Statistic
          title="Finalizados"
          value={props.resumo ? props.resumo.finalizados : 0}
        />
      </Col>
      <Col span={8} style={style}>
        <Statistic
          title="Pendentes Sem Envolvidos"
          value={props.resumo ? props.resumo.pendentesSemEnvolvidos : 0}
        />
      </Col>
      <Col span={8} style={style}>
        <Statistic
          title="Finalizados Sem Envolvidos"
          value={props.resumo ? props.resumo.finalizadosSemEnvolvidos : 0}
        />
      </Col>
    </Row>
  );
};

export default ResumoVisaoMtn;
