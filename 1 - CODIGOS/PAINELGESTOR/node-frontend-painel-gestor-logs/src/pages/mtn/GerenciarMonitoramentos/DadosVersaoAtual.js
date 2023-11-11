import React from "react";
import { Row, Col, Descriptions, Alert, Typography } from "antd";
import { downloadDocumentoParametro } from "../../../services/ducks/MtnComite.ducks";

const { Link } = Typography;

const DadosParametrosAtual = (props) => {
  const { versaoAtual, setLoading } = props;

  if (versaoAtual === null) {
    return (
      <Alert
        message="Este monitoramento não tem nenhuma versão cadastrada."
        type="info"
        showIcon
      />
    );
  }

  return (
    <Row>
      <Col span={24}>
        <Descriptions column={4} bordered>
          <Descriptions.Item label="Incluído Por" span={4}>
            {`${versaoAtual.incluidoPor} - ${versaoAtual.incluidoPorNome}`}
          </Descriptions.Item>
          <Descriptions.Item label="Status" span={2}>
            {versaoAtual.status.display}
          </Descriptions.Item>
          <Descriptions.Item label="Data Criação" span={2}>
            {versaoAtual.createdAt}
          </Descriptions.Item>
          <Descriptions.Item label="Motivação" span={4}>
            {versaoAtual.motivacao}
          </Descriptions.Item>
          <Descriptions.Item label="Documento Parâmetros" span={4}>
            <Link
              onClick={() => {
                setLoading(true);
                downloadDocumentoParametro(
                  versaoAtual.documento.idDocumento,
                  versaoAtual.documento.nomeDocumento
                ).then().catch().then(() => {
                  setLoading(false)
                });
              }}
            >
              {versaoAtual.documento.nomeOriginal}
            </Link>
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </Row>
  );
};

export default DadosParametrosAtual;
