import React from "react";

import { Col, Row, Descriptions } from "antd";

const LocalDaEntrega = (props) => {
  const { solicitacao } = props;
  if (!solicitacao) {
    return null;
  }
  return (
    <Row style={{ marginBottom: "25px" }}>
      <Col span={24}>
        <Descriptions layout="vertical" column={4} size={"small"} bordered>
          <Descriptions.Item span={4} label="Local da entrega">
            {solicitacao.dadosEntrega && solicitacao.dadosEntrega.localEntrega
              ? solicitacao.dadosEntrega.localEntrega
              : "Não informado"}
          </Descriptions.Item>
          {solicitacao.dadosEntrega && solicitacao.dadosEntrega.prefixoEntrega && (
            <Descriptions.Item span={4} label="Prefixo da entrega">
              {`${solicitacao.dadosEntrega.prefixoEntrega.prefixo} - ${solicitacao.dadosEntrega.prefixoEntrega.nome}`}
            </Descriptions.Item>
          )}
          <Descriptions.Item span={4} label="Complemento">
            {solicitacao.dadosEntrega &&
            solicitacao.dadosEntrega.complementoEntrega
              ? solicitacao.dadosEntrega.complementoEntrega
              : "Não informado"}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default LocalDaEntrega;
