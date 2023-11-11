import React from "react";
import { Col, Row, Typography } from "antd";
const { Text } = Typography;
const RowExpand = (props) => {

  const {record} = props;
  return (
    <Row align="middle" style={{ height: "100%" }}>
      <Col span={24}>
        <Row>
          <Col span={24}>
            <Row style={{ textAlign: "left" }}>
              <Col span={11} offset={1}>
                <Text strong>Prefixo: </Text>{" "}
                {`${record.mtn.prefixo} - ${record.mtn.nomePrefixo}`}
              </Col>
              <Col span={11}>
                <Text strong>Super Comercial: </Text>{" "}
                {record.mtn.nomeSuperComercial
                  ? `${record.mtn.prefixoSuperComercial} - ${record.mtn.nomeSuperComercial}`
                  : `Não se aplica`}
              </Col>
            </Row>
            <Row style={{ textAlign: "left" }}>
              <Col span={11} offset={1}>
                <Text strong>Super Negocial: </Text>{" "}
                {record.mtn.prefixoSuperNegocial
                  ? `${record.mtn.prefixoSuperNegocial} - ${record.mtn.nomeSuperNegocial}`
                  : `Não se aplica`}
              </Col>
              <Col span={12}>
                <Text strong>Unidade Estratégica: </Text>
                {record.mtn.nomeUnidadeEstrategia
                  ? `${record.mtn.prefixoUnidadeEstrategica} -${record.mtn.nomeUnidadeEstrategia}`
                  : `Não se aplica`}
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default RowExpand;
