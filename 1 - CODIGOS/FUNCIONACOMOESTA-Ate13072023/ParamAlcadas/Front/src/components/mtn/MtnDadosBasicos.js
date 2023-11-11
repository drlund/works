import React from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  Button,
  Popconfirm,
  Alert,
  Space,
} from "antd";
import StyledCard from "components/styledcard/StyledCardPrimary";
// import { Link } from "react-router-dom";
import MtnFinalizaProtocolo from "./MtnFinalizarProtocolo";
import ReactHtmlParser from "react-html-parser";
import history from "@/history.js";

import constants from "utils/Constants";
const { ID_STATUS_FINALIZADO } = constants;

const { Text, Title } = Typography;

export default function MtnDadosBasicos(props) {
  const {
    nrMtn,
    visao,
    orientJustVisao,
    status,
    idStatus,
    dadosPrefixo,
    abertoEm,
    lock,
    descOcorrencia,
    id,
  } = props.dadosBasicos;

  const btnAvocar = () => {
    if (props.readOnly || props.esconderAvocar) {
      return "";
    }

    if (!lock) {
      return (
        <Button onClick={() => props.criarLock()}>Avocar Protocolo</Button>
      );
    }

    if (lock && lock.matriculaAnalista !== props.matriculaLogado) {
      return (
        <Popconfirm
          title={`Tem certeza que deseja avocar este protocolo para si? Em análise por ${lock.matriculaAnalista} - ${lock.nomeAnalista}.`}
          onConfirm={() => props.avocarLock()}
          okText="Sim"
          cancelText="Não"
        >
          <Button style={{ marginRight: 30 }}>Avocar Protocolo de outro</Button>
        </Popconfirm>
      );
    }

    if (lock && lock.matriculaAnalista === props.matriculaLogado) {
      return (
        <Popconfirm
          title="Tem certeza que deseja liberar este protocolo da sua reponsabilidade?"
          onConfirm={() => props.liberarLock()}
          okText="Sim"
          cancelText="Não"
        >
          <Button style={{ marginRight: 30 }}>Liberar Protocolo</Button>
        </Popconfirm>
      );
    }
  };

  const btnFinalizar = () => {
    if (
      props.readOnly ||
      props.esconderAvocar ||
      idStatus === ID_STATUS_FINALIZADO ||
      (props.dadosBasicos && props.dadosBasicos.qtdEnvolvidos > 0)
    ) {
      return "";
    }

    return <MtnFinalizaProtocolo idMtn={id} fetchMtn={props.fetchMtn} />;
  };

  return (
    <StyledCard
      type="flex"
      title="Dados Básicos"
      noShadow={false}
      extra={
        <Space size={30}>
          {btnAvocar()}
          {btnFinalizar()}
          {props.dadosBasicos.qtdEnvolvidos === 0 && (
            <Button
              href={`../questionario-info/${null}/${props.dadosBasicos.id}`}
              target="_blank"
            >
              Questionario
            </Button>
          )}
          <Button
            onClick={() => {
              history.goBack();
            }}
          >
            {" "}
            Voltar
          </Button>
        </Space>
      }
    >
      {lock && idStatus !== ID_STATUS_FINALIZADO && (
        <Row style={{width: "100%"}}>
          <Col style={{ textAlign: "center", lineHeight: "50px" }} span={24}>
            <Alert
              message={`Em análise por ${lock.matriculaAnalista} - ${lock.nomeAnalista}`}
              type={
                lock.matriculaAnalista !== props.matriculaLogado
                  ? "error"
                  : "info"
              }
            />
          </Col>
        </Row>
      )}
      <Card.Grid style={{ width: "25%", height: "200px" }}>
        <Row type="flex" align="middle" style={{ height: "100%" }}>
          <Col span={24} style={{ textAlign: "center" }}>
            <Text>Nr. Protocolo: </Text>
            <Title level={4}>{nrMtn}</Title>
            <Text strong>Status: </Text> {status} <br />
            <Text strong>Aberto em : </Text> {abertoEm}
          </Col>
        </Row>
      </Card.Grid>

      <Card.Grid style={{ width: "75%", textAlign: "center", height: "200px" }}>
        <Row align="middle" style={{ height: "100%" }}>
          <Col span={24}>
            <Row>
              <Col span={24}>
                <Row style={{ textAlign: "left" }}>
                  <Col span={11} offset={1}>
                    <Text strong>Prefixo: </Text>{" "}
                    {`${dadosPrefixo.prefixo} - ${dadosPrefixo.nomePrefixo}`}
                  </Col>
                  <Col span={11}>
                    <Text strong>Super Comercial: </Text>{" "}
                    {`${dadosPrefixo.superComercial.prefixo} - ${dadosPrefixo.superComercial.nome}`}
                  </Col>
                </Row>
                <Row style={{ textAlign: "left" }}>
                  <Col span={11} offset={1}>
                    <Text strong>Super Negocial: </Text>{" "}
                    {`${dadosPrefixo.superNegocial.prefixo} - ${dadosPrefixo.superNegocial.nome}`}
                  </Col>
                  <Col span={12}>
                    <Text strong>Unidade Estratégica: </Text>
                    {`${dadosPrefixo.unidadeEstrategica.prefixo} - ${dadosPrefixo.unidadeEstrategica.nome}`}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card.Grid>

      <Card.Grid style={{ width: "30%", textAlign: "center"}}>
        <Text strong>Monitoramento: </Text> {visao} <br />
      </Card.Grid>
      <Card.Grid style={{ width: "70%", textAlign: "center" }}>
        <Text strong>Desc. Monitoramento: </Text> {orientJustVisao}
        <br />
      </Card.Grid>
      {props.admin && (
        <Card.Grid style={{ width: "100%", textAlign: "center" }}>
          <Text strong>Descr. Ocorrência: </Text>
          <span>{ReactHtmlParser(descOcorrencia)}</span>
          <br />
        </Card.Grid>
      )}
    </StyledCard>
  );
}
