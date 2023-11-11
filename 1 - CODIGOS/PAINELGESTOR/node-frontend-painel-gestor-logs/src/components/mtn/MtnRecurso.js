import React, { Component } from "react";
import { QuestionCircleTwoTone } from "@ant-design/icons";
import { Card, Typography, Row, Col, Tooltip, Collapse, Tag } from "antd";
import styled from "styled-components";
import { connect } from "react-redux";
import { downloadAnexo } from "services/ducks/Mtn.ducks";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import constants from "utils/Constants";
const { Panel } = Collapse;
const { Paragraph, Text } = Typography;

const { MTN } = constants;

const RespostaRecurso = styled.div`
  position: relative;
  .data {
    display: inline-block;
    bottom: 0;
  }
`;

const AnexoLink = styled.div`
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    font-size: 105%;
  }
`;

const labelSpan = 7;
class MtnRecurso extends Component {
  state = {
    loading: true,
  };

  renderRespRecurso = (recurso) => {
    if (!recurso.respondidoEm && !recurso.reveliaEm) {
      return <Text type="danger"> Aguardando recurso</Text>;
    }

    return (
      <RespostaRecurso>
        <Paragraph className="conteudo"> {recurso.txtRecurso} </Paragraph>
        <Text className="data" type="secondary">
          {recurso.respondidoEm}
        </Text>
      </RespostaRecurso>
    );
  };

  baixarAnexo = (anexo, downloadFunc) => {
    downloadFunc({
      idAnexo: anexo.idAnexo,
      fileName: anexo.nomeArquivo,
      responseHandler: {
        successCallback: () => console.log('Baixado'),
        errorCallback: () => console.log('erro no download'),
      },
    });
  };

  getMsgLido = (recurso) => {
    const foiLido = recurso.lido === true || recurso.respondidoEm !== null;

    return foiLido ? (
      <Tooltip
        title={
          recurso.lidoEm === null
            ? `Data de leitura não disponível`
            : `1ª leitura em ${recurso.lidoEm}`
        }
      >
        <Tag icon={<EyeOutlined />} color="#78D14B">
          Lido
        </Tag>
      </Tooltip>
    ) : (
      <Tag icon={<EyeInvisibleOutlined />} color="#F5313B">
        Não Lido
      </Tag>
    );
  };

  getHeaderRecurso = (recurso) => {
    if (recurso.respondidoEm) {
      return (
        <Text>
          Recurso respondido dia <Text strong>{recurso.respondidoEm}</Text>
        </Text>
      );
    }
    if (recurso.reveliaEm) {
      return (
        <Text>
          Fechado automaticamente no dia <Text strong>{recurso.reveliaEm}</Text>
        </Text>
      );
    }
    return <Text type="danger">Recurso pendente</Text>;
  };

  renderListaAnexos = (anexos, labelAnexos) => {
    if (anexos.length > 0) {
      let arrayAnexos = anexos.map((anexo) => {
        return (
          <AnexoLink
            onClick={() => this.baixarAnexo(anexo, this.props.downloadAnexo)}
          >
            {anexo.nomeArquivo}
          </AnexoLink>
        );
      });

      return (
        <span>
          <Col span={labelSpan}>
            <Text strong>{labelAnexos}</Text>
          </Col>
          <Col span={24 - labelSpan}>{arrayAnexos}</Col>
        </span>
      );
    }
  };

  render() {
    const arrayRecursos = [];
    for (let recurso of this.props.recursos) {
      let header = this.getHeaderRecurso(recurso);
      const msgLido = this.getMsgLido(recurso);
      console.log();
      const elemRecurso = (
        <Collapse key={recurso.id}>
          <Panel header={header} extra={msgLido}>
            <Row gutter={[10, 16]}>
              <Col span={labelSpan}>
                <Text strong>Analistas:</Text>
              </Col>
              <Col span={24 - labelSpan}>
                {`${recurso.matRespAnalise} - ${recurso.nomeRespAnalise}`}
              </Col>

              <Col span={labelSpan}>
                <Text strong>Data Parecer:</Text>
              </Col>
              <Col span={24 - labelSpan}>{recurso.dataCriacao}</Col>

              <Col span={labelSpan}>
                <Text strong>Prazo:</Text>
              </Col>

              <Col span={24 - labelSpan}>
                <Tooltip
                  placement="topRight"
                  title={'Qtd. dias Transcorridos / Prazo Total'}
                >
                  <Text style={{ display: "inline-block", marginRight: 10 }}>
                    {" "}
                    {recurso.qtdDiasTrabalhados} / {MTN.prazoMaxRecurso}
                  </Text>{" "}
                  <QuestionCircleTwoTone />
                </Tooltip>
              </Col>

              <Col span={labelSpan}>
                <Text strong>Medida original:</Text>
              </Col>
              <Col span={24 - labelSpan}>
                {recurso.medida ? recurso.medida.txtMedida : ''}
              </Col>
              <Col span={labelSpan}>
                <Text strong>Parecer original:</Text>
              </Col>
              <Col span={24 - labelSpan}>
                <Paragraph style={{whiteSpace: "pre-line"}}>{recurso.txtParecer}</Paragraph>
              </Col>
              <Col span={24}>
                {recurso.anexosParecer.length > 0 &&
                  this.renderListaAnexos(
                    recurso.anexosParecer,
                    'Anexos da Análise',
                  )}
              </Col>
              <Col span={labelSpan}>
                <Text strong>Recurso:</Text>
              </Col>
              <Col span={24 - labelSpan}>
                <Card>{this.renderRespRecurso(recurso)}</Card>
              </Col>
              <Col span={24}>
                {recurso.anexos.length > 0 &&
                  this.renderListaAnexos(recurso.anexos, 'Anexos do Recurso')}
              </Col>
            </Row>
          </Panel>
        </Collapse>
      );
      arrayRecursos.push(elemRecurso);
    }

    return <Collapse defaultActiveKey={['1']}>{arrayRecursos}</Collapse>;
  }
}

export default connect(null, {
  downloadAnexo,
})(MtnRecurso);
