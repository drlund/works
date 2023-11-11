import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, message, Alert, Result } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
// import FormComprovantePagamento from "./FormComprovantePagamento";
import {
  confirmarPgto,
  cancelarRegistroPgto,
  getDadosOcorrenciaConfirmaPgto,
} from "services/ducks/Tarifas.ducks";

import ConfirmaPgtoForm from "./ConfirmaPgtoForm";
import DadosOcorrencia from "./DadosOcorrencia";
import DadosPagamento from "./DadosPagamento";
import DadosConfirmacao from "./DadosConfirmacao";
import { useParams } from "react-router-dom";
import LinhaTempoOcorrencia from "./LinhaTempoOcorrencia";
import useIsNivelGerencial from "hooks/useIsNivelGerencial";

const { Title, Paragraph, Text } = Typography;

const RegistrarPagamento = (props) => {
  const [loading, setLoading] = useState(false);
  const [ocorrencia, setOcorrencia] = useState(null);
  const [observacao, setObservacao] = useState("");
  const { idOcorrencia } = useParams();
  const isNivelGerencial = useIsNivelGerencial();

  const onConfirmaPgto = async (observacao) => {
    setLoading(true);

    confirmarPgto(observacao, ocorrencia.pagamento.id)
      .then(() => {
        setOcorrencia(null);
        message.success("Salvo com sucesso");
      })
      .catch((errorMessage) => {
        message.error(errorMessage);
      })
      .then(() => setLoading(false));
  };

  const onCancelarPgto = async (observacao) => {
    setLoading(true);

    cancelarRegistroPgto(observacao, ocorrencia.pagamento.id)
      .then(() => {
        setOcorrencia(null);
        message.success("Salvo com sucesso");
      })
      .catch((errorMessage) => {
        message.error(errorMessage);
      })
      .then(() => setLoading(false));
  };

  useEffect(() => {
    if (ocorrencia === null) {
      setLoading(true);
      getDadosOcorrenciaConfirmaPgto(idOcorrencia)
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

  if (!isNivelGerencial) {
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
          <Result
            status="info"
            title={<Text>Você não tem acesso para confirmar o pagamento.</Text>}
          />
        </Col>
      </Row>
    );
  }

  const isPagamentoRegistrado = ocorrencia && ocorrencia.pagamento !== null;
  const isOcorrenciaReservada = ocorrencia && ocorrencia.reserva !== null;
  const isPagamentoConfirmado =
    ocorrencia &&
    ocorrencia.pagamento !== null &&
    ocorrencia.pagamento.confirmacoes !== null;

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

  if (!isOcorrenciaReservada) {
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
          <Result
            status="info"
            title={
              <Text>Este pagamento não foi reservado para pagamento.</Text>
            }
          />
        </Col>
      </Row>
    );
  }

  if (!isPagamentoRegistrado) {
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
          <Result
            status="info"
            title={<Text>O pagamento ainda não foi registrado.</Text>}
          />
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
              Nesta etapa, o funcionário de nível gerencial vai confirmar que o
              processo foi efetuado e que o comprovante de pagamento ao cliente
              foi corretamente anexado na ferramenta. Siga os passos abaixo:
            </Paragraph>
            <Paragraph>
              <ol>
                <li>
                  Confira todos os dados registrados e verifique se o
                  comprovante de pagamento está correto e legível.
                </li>
                <li>Clique em “confirma pagamento”.</li>
              </ol>
            </Paragraph>

            <Paragraph>Após a finalização, o processo está encerrado.</Paragraph>
          </Card>
        </Col>
        <Col span={11}>
          <Card>
            <DadosOcorrencia
              esconderTabs={["Pagamento"]}
              ocorrencia={ocorrencia}
            />
          </Card>
        </Col>
        <Col span={11}>
          <Card>
            {!isPagamentoConfirmado ? (
              <>
                <DadosPagamento ocorrencia={ocorrencia} />
                <ConfirmaPgtoForm
                  onConfirmaPgto={onConfirmaPgto}
                  onCancelarPgto={onCancelarPgto}
                  observacao={observacao}
                  setObservacao={setObservacao}
                  ocorrencia={ocorrencia}
                />
              </>
            ) : (
              <>
                <Alert
                  style={{ marginBottom: 15 }}
                  message="O pagamento já foi confirmado."
                  type="error"
                />
                <DadosConfirmacao ocorrencia={ocorrencia} />
              </>
            )}
          </Card>
        </Col>
        <Col span={11}>
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

export default RegistrarPagamento;
