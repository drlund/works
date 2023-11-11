import React from "react";

import { Col, Row, Card, Avatar, Descriptions, Typography } from "antd";
import { getProfileURL } from "utils/Commons";
import { downloadAnexo } from "services/ducks/Encantar.ducks";
import styled from "styled-components";
const { Text } = Typography;
const { Meta } = Card;

const AnexoLink = styled.div`
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    font-size: 105%;
  }
`;

const renderListaAnexos = (anexos, labelAnexos) => {
  if (anexos.length > 0) {
    let arrayAnexos = anexos.map((anexo) => {
      return (
        <AnexoLink onClick={() => downloadAnexo(anexo.id, anexo.nomeArquivo)}>
          {anexo.nomeOriginal}
        </AnexoLink>
      );
    });

    return (
      <span>
        <Col span={8}>
          <Text strong>{labelAnexos}</Text>
        </Col>
        <Col span={24 - 8}>{arrayAnexos}</Col>
      </span>
    );
  }
};

const DadosEntregaCliente = (props) => {
  if (!props.solicitacao || !props.solicitacao.envio) {
    return null;
  }

  // Traz a última entrega registrada
  const entregaCliente = props.solicitacao.entregaCliente.slice(-1).pop();

  if (!entregaCliente) {
    return null;
  }

  return (
    <Row gutter={[0, 25]}>
      <Col span={24}>
        <Card style={{ padding: "20px 0px;" }}>
          <Meta
            avatar={
              <Avatar
                src={getProfileURL(entregaCliente.matriculaRegistroEntrega)}
              />
            }
            title={entregaCliente.nomeRegistroEntrega}
          />

          <Descriptions
            style={{ marginTop: 20 }}
            column={4}
            size={"small"}
            bordered
          >
            <Descriptions.Item span={4} label="Resultado da Entrega">
              {entregaCliente.resultadoEntregaCliente
                ? entregaCliente.resultadoEntregaCliente
                : "Não disponível"}
            </Descriptions.Item>
            <Descriptions.Item span={4} label="Registrado Em">
              {entregaCliente.createdAt
                ? entregaCliente.createdAt
                : "Não disponível"}
            </Descriptions.Item>
            <Descriptions.Item span={4} label="Data resultado da entrega">
              {entregaCliente.dataResultadoEntrega
                ? entregaCliente.dataResultadoEntrega
                : "Não disponível"}
            </Descriptions.Item>
            {entregaCliente.informacoes && (
              <Descriptions.Item span={4} label="Informações Complementares">
                {entregaCliente.informacoes
                  ? entregaCliente.informacoes
                  : "Não disponível"}
              </Descriptions.Item>
            )}
          </Descriptions>
          <div style={{ marginTop: 15, marginLeft: 5 }}>
            {entregaCliente.anexos &&
              renderListaAnexos(entregaCliente.anexos, "Anexos")}
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default DadosEntregaCliente;
