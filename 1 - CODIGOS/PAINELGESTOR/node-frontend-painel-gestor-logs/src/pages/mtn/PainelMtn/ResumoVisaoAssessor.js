import React from "react";
import { Col, Row, Statistic } from "antd";

const ResumoVisaoAssessor = (props) => {

  return (
    <Row gutter={[0, 16]} justify="center" align="middle">
      {props.resumo.map((acao) => {
        return (
          <Col
            span={6}
            style={{
              display: "flex",
              alignContent: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            <Statistic title={acao.display} value={acao.total} />
          </Col>
        );
      })}
      <Col
        span={6}
        style={{
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <Statistic title={"Total"} value={props.total} />
      </Col>
    </Row>
  );
};

export default ResumoVisaoAssessor;
