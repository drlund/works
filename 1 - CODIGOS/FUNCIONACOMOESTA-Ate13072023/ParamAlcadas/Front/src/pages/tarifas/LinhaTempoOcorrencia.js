import React from "react";
import { Row, Col, Timeline } from "antd";
import LinkHumanograma from "components/LinkHumanograma/LinkHumanograma";
// import {
//   DollarCircleOutlined,
//   ClockCircleOutlined,
//   CheckCircleOutlined,
// } from "@ant-design/icons";

const LinhaTempoOcorrencia = (props) => {
  const { ocorrencia } = props;

  if (!ocorrencia) {
    return null;
  }

  const linhaTempo = ocorrencia.linhaTempo ? ocorrencia.linhaTempo : [];

  return (
    <Row>
      <Col span={24}>
        <Timeline>
          {linhaTempo.map((acao) => {
            return (
              <Timeline.Item>
                {`${acao.funcionario.matricula} - `}
                <LinkHumanograma matriculaFunci={acao.funcionario.matricula}>
                  {`${acao.funcionario.nome}`}
                </LinkHumanograma>
                {` ${acao.acao} em ${acao.ocorridoEm}`}
              </Timeline.Item>
            );
          })}
        </Timeline>
        ,
      </Col>
    </Row>
  );
};

export default LinhaTempoOcorrencia;
