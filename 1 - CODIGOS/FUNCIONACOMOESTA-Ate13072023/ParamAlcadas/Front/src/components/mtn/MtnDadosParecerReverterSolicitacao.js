import React from "react";
import { Descriptions, Typography, Col, Row, message } from "antd";
import { downloadAnexoSemRedux } from "services/ducks/Mtn.ducks";
import styled from "styled-components";
const { Text } = Typography;

const AnexoLink = styled.div`
  color: #1890ff;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    font-size: 105%;
  }
`;

const getDadosAlteracao = (envolvido) => {
  return envolvido &&
    envolvido.alteracoesMedida &&
    envolvido.alteracoesMedida[0]
    ? envolvido.alteracoesMedida[0]
    : null;
};

const DadosParecer = (props) => {
  const dadosAlteracao = getDadosAlteracao(props.envolvido);

  const renderAnexos = (anexos) => {
    return (
      <Descriptions.Item label={<Text strong>Anexos</Text>}>
        {anexos && anexos.length > 0 ? (
          anexos.map((anexo) => {
            return (
              <AnexoLink
                onClick={() => {
                  downloadAnexoSemRedux({
                    idAnexo: anexo.idAnexo,
                    fileName: anexo.nomeArquivo,
                    responseHandler: {
                      successCallback: () => console.log("Baixado"),
                      errorCallback: () => message.error("Erro no download"),
                    },
                  });
                }}
              >
                {anexo.nomeArquivo}
              </AnexoLink>
            );
          })
        ) : (
          <Text type="secondary">Nenhum anexo incluído</Text>
        )}
      </Descriptions.Item>
    );
  };

  return (
    <Row gutter={[0, 25]}>
      <Col span={24}>
        <Descriptions
          title="Dados do Parecer"
          column={1}
          bordered={true}
          layout="horizontal"
          size="small"
        >
          <Descriptions.Item label={<Text strong>Nr. Mtn</Text>}>
            {props.envolvido.nrMtn}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Envolvido</Text>}>
            {props.envolvido.matricula} - {props.envolvido.nomeFunci}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Analista</Text>}>
            {props.envolvido.matRespAnalise} - {props.envolvido.nomeRespAnalise}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Data do Parecer</Text>}>
            {props.envolvido.respondidoEm}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Medida</Text>}>
            {props.envolvido.medidaSelecionada.txtMedida}
          </Descriptions.Item>
          <Descriptions.Item label={<Text strong>Parecer</Text>}>
            {props.envolvido.txtAnalise}
          </Descriptions.Item>
          {renderAnexos(props.envolvido.anexos)}
        </Descriptions>
      </Col>

      <Col span={24}>
        {props.envolvido.recursos.map((recurso) => {
          return (
            <Descriptions
              title="Dados do Recurso"
              style={{ marginTop: 20 }}
              column={1}
              bordered={true}
              layout="horizontal"
              size="small"
            >
              <Descriptions.Item
                label={<Text strong>Analista parecer original</Text>}
              >
                {recurso.matRespAnalise} - {recurso.nomeRespAnalise}
              </Descriptions.Item>
              <Descriptions.Item
                label={<Text strong>Data do Parecer original</Text>}
              >
                {recurso.dataCriacao}
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Parecer Original</Text>}>
                <p style={{ maxWidth: 433 }}>{recurso.txtParecer}</p>
              </Descriptions.Item>
              <Descriptions.Item label={<Text strong>Recurso</Text>}>
                {recurso.txtRecurso}
              </Descriptions.Item>
              {renderAnexos(recurso.anexos)}
            </Descriptions>
          );
        })}
      </Col>
      <Col span={24}>
        {dadosAlteracao && (
          <Descriptions
            title="Solicitação de Reversão"
            column={1}
            bordered={true}
            layout="horizontal"
            size="small"
          >
            <Descriptions.Item label={<Text strong>Solicitante</Text>}>
              {`${dadosAlteracao.matriculaSolicitante} - ${dadosAlteracao.nomeSolicitante}`}
            </Descriptions.Item>
            <Descriptions.Item label={<Text strong>Data Solicitação</Text>}>
              {dadosAlteracao.dataCriacao}
            </Descriptions.Item>
            <Descriptions.Item label={<Text strong>Nova Medida</Text>}>
              {dadosAlteracao.medidaNova.txtMedida}
            </Descriptions.Item>
            <Descriptions.Item label={<Text strong>Justificativa </Text>}>
              {dadosAlteracao.justificativa}
            </Descriptions.Item>
            {renderAnexos(dadosAlteracao.anexos)}
          </Descriptions>
        )}
      </Col>
    </Row>
  );
};

export default DadosParecer;
