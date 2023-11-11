import React, { useState, useEffect } from "react";
import { Row, Col, Card, Typography, message, Alert, Result } from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import FormComprovantePagamento from "./FormComprovantePagamento";
import { registrarPagamento } from "services/ducks/Tarifas.ducks";
import DadosOcorrencia from "./DadosOcorrencia";
import DadosPagamento from "./DadosPagamento";
import { useParams } from "react-router-dom";
import LinhaTempoOcorrencia from "./LinhaTempoOcorrencia";
import moment from "moment";
const { Title, Paragraph, Text } = Typography;

const RegistrarPagamento = (props) => {
  const { getDadosOcorrencia } = props;
  const [loading, setLoading] = useState(false);
  const [ocorrencia, setOcorrencia] = useState(null);
  const { idOcorrencia } = useParams();

  const isDadosPagamentoValidos = (dadosPagamento) => {
    const { anexos, dataPagamento, observacoes } = dadosPagamento;
    if (!anexos || !Array.isArray(anexos) || anexos.length === 0) {
      message.error("Inclua ao menos um comprovante de pagamento");
      setLoading(false);
      return false;
    }

    if (!dataPagamento) {
      message.error("Informe a data de pagamento.");
      setLoading(false);
      return false;
    }

    if (
      moment(dataPagamento).format("YYYY-MM-DD") !==
        moment().format("YYYY-MM-DD") &&
      !observacoes
    ) {
      message.error(
        "Para pagamentos anteriores à data atual, a observação é obrigatória."
      );
      setLoading(false);
      return false;
    }

    return true;
  };

  const onRegistrarPagamento = async (dadosPagamento) => {
    setLoading(true);

    if (isDadosPagamentoValidos(dadosPagamento)) {
      registrarPagamento(dadosPagamento, idOcorrencia)
        .then(() => {
          setOcorrencia(null);
          message.success("Salvo com sucesso");
        })
        .catch((errorMessage) => {
          message.error(errorMessage);
        })
        .then(() => setLoading(false));
    }
  };

  useEffect(() => {
    if (ocorrencia === null) {
      setLoading(true);
      getDadosOcorrencia(idOcorrencia)
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
  }, [ocorrencia, idOcorrencia, getDadosOcorrencia]);

  const isPagamentoRegistrado = ocorrencia && ocorrencia.pagamento !== null;
  const isOcorrenciaReservada = ocorrencia && ocorrencia.reserva !== null;

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

  return (
    <BBSpinning spinning={loading}>
      <Row gutter={[20, 20]}>
        <Col span={11}>
          <Card>
            <Title level={5}>Instruções</Title>
            <Paragraph>
              Conforme Comunicados a Administradores 2021/09227083
              (Divar) e 2021/09229822 (Dirav) - CTR ESTORNO DE VALORES, de
              29/07/2021, após você registrar o CTR e o cliente receber o
              pagamento no caixa, você deve pegar o comprovante do caixa,
              digitalizar o documento e incluir nesta ferramenta. Seguem
              orientações:
            </Paragraph>
            <Paragraph>
              <ul>
                <li>
                  Clique em “selecione comprovantes” (o documento deve ser na
                  extensão XPTO, XPTO, XPTO).
                </li>
                <li>Clique em “salvar comprovantes”.</li>
                <li>
                  Após salvar o comprovante, solicite a um Gerente para
                  confirmar o pagamento no menu à esquerda, opção “Gerenciar”.
                  Atenção: valores superiores a R$ 2.000,00 (dois mil) só podem
                  ser liberados por Gerente Geral.
                </li>
              </ul>
            </Paragraph>
          </Card>
        </Col>
        <Col span={11}>
          <Card>
            <DadosOcorrencia
              esconderTabs={["Pagamento", "Confirmacao"]}
              ocorrencia={ocorrencia}
            />
          </Card>
        </Col>
        <Col span={11}>
          <Card>
            {isPagamentoRegistrado ? (
              <>
                <Alert
                  style={{ marginBottom: 15 }}
                  message="O comprovante já foi incluído."
                  type="error"
                />
                <DadosPagamento ocorrencia={ocorrencia} />
              </>
            ) : (
              <FormComprovantePagamento
                onRegistrarPagamento={onRegistrarPagamento}
              />
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
