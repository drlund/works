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

const DadosDevolucao = (props) => {

  const { tratamentoDevolucao } = props.solicitacao;

  return     <Row gutter={[0, 25]}>
  <Col span={24}>
    <Card style={{ padding: "20px 0px;" }}>
      <Meta
        avatar={
          <Avatar
            src={getProfileURL(tratamentoDevolucao.respRegistroMatricula)}
          />
        }
        title={tratamentoDevolucao.respRegistroNome}
      />

      <Descriptions
        style={{ marginTop: 20 }}
        column={4}
        size={"small"}
        bordered
      >
        <Descriptions.Item span={4} label="Informações ">
          {tratamentoDevolucao.informacoesDevolucao}
        </Descriptions.Item>
        <Descriptions.Item span={4} label="Registrado Em">
          {tratamentoDevolucao.createdAt}
        </Descriptions.Item>
 
      </Descriptions>
      <div style={{ marginTop: 15, marginLeft: 5 }}>
        {tratamentoDevolucao.anexos &&
          renderListaAnexos(tratamentoDevolucao.anexos, "Anexos")}
      </div>
    </Card>
  </Col>
</Row>;
};

export default DadosDevolucao;
