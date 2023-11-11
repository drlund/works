import React from "react";

import {
  Col,
  Row,
  Card,
  Avatar,
  Descriptions,
  Typography,
  
} from "antd";
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

const RecebimentoRegistrado = (props) => {
  if (!props.solicitacao) {
    return null;
  }

  const { envio } = props.solicitacao;

  return (
    <Row gutter={[0, 25]}>
      <Col span={24}>
        <Card style={{ padding: "20px 0px;" }} title={"Dados do Recebimento"}>
          <Meta
            avatar={<Avatar src={getProfileURL(envio.matriculaRecebimento)} />}
            title={envio.nomeRecebimento}
          />

          <Descriptions
            style={{ marginTop: 20 }}
            column={4}
            size={"small"}
            bordered
          >
            <Descriptions.Item span={4} label="Data do Recebimento">
              {envio.dataRecebimento}
            </Descriptions.Item>
            {
              envio.observacaoRecebimento &&
            <Descriptions.Item span={4} label="Observações do Recebimento">
              {envio.observacaoRecebimento}
            </Descriptions.Item>
            }
            
          </Descriptions>
          {envio.anexos && renderListaAnexos(envio.anexos, "Anexos")}
        </Card>
      </Col>
    </Row>
  );
};

export default RecebimentoRegistrado;
