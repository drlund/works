import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, message } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import { getDadosOcorrenciaFinalizada } from "services/ducks/Tarifas.ducks";
import DadosOcorrencia from "./DadosOcorrencia";
import { useParams } from "react-router-dom";
import LinhaTempoOcorrencia from "./LinhaTempoOcorrencia";

const { Title, Paragraph } = Typography;

const OcorrenciaFinalizada = (props) => {
  const [loading, setLoading] = useState(false);
  const [ocorrencia, setOcorrencia] = useState(null);
  const { idOcorrencia } = useParams();

  useEffect(() => {
    if (ocorrencia === null) {
      setLoading(true);
      getDadosOcorrenciaFinalizada(idOcorrencia)
        .then((dadosOcorrencia) => {
          setOcorrencia(dadosOcorrencia);
        })
        .catch((error) => {
          message.error(error);
        })
        .then(() => {
          setLoading(false);
        });
    }
  }, [ocorrencia, idOcorrencia]);

  if (ocorrencia === null) {
    return (
      <Row>
        <Col
          span={24}
          style={{
            height: 800,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BBSpinning spinning={loading} />
        </Col>
      </Row>
    );
  }

  return (
    <BBSpinning spinning={loading}>
      <Row gutter={[20, 20]}>
        <Col span={11}>
          <Card>
            <Title level={5}>Instruções</Title>
            <Paragraph>
              Conforme Comunicados a Administradores 2021/09227083
              (Divar) e 2021/09229822 (Dirav) - CTR ESTORNO DE VALORES, de
              29/07/2021, um ocorrência é finalizada após a reserva para
              pagamento, inclusão do comprovante de pagamento e a posterior
              confirmação do comprovante.
            </Paragraph>
          </Card>
        </Col>
        <Col span={11}>
          <Card>
            <DadosOcorrencia ocorrencia={ocorrencia} />
          </Card>
        </Col>
        <Col offset={7} span={10}>
          <Card>
            <Title level={5} style={{ marginBottom: 30 }}>
              Linha do tempo
            </Title>
            <LinhaTempoOcorrencia ocorrencia={ocorrencia} />
          </Card>
        </Col>
      </Row>
    </BBSpinning>
  );
};

export default OcorrenciaFinalizada;
