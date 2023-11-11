import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  Typography,
  message,
  Alert,
  Result,
  Form,
  Input,
  Button,
  Modal,
} from "antd";
import BBSpinning from "components/BBSpinning/BBSpinning";
import {
  cancelarReserva,
  getDadosOcorrenciaCancelar,
} from "services/ducks/Tarifas.ducks";
import DadosOcorrencia from "./DadosOcorrencia";
import DadosPagamento from "./DadosPagamento";
import { useParams } from "react-router-dom";
import LinhaTempoOcorrencia from "./LinhaTempoOcorrencia";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { confirm } = Modal;
const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const CancelarReserva = (props) => {
  const [loading, setLoading] = useState(false);
  const [ocorrencia, setOcorrencia] = useState(null);
  const [observacao, setObservacao] = useState("");
  const { idOcorrencia } = useParams();

  const onCancelarReserva = async () => {
    // setLoading(true);

    if (!observacao || observacao === "") {
      message.error("A observação é obrigatória.");
      return;
    }

    cancelarReserva(observacao, ocorrencia.reserva.id)
      .then(() => {
        setOcorrencia(null);
        message.success("Salvo com sucesso");
      })
      .catch((errorMessage) => {
        message.error(errorMessage);
      })
      .then(() => setLoading(false));
  };

  function confirmarCancelamento() {
    confirm({
      title: "Deseja cancelar a reserva para pagamento?",
      icon: <ExclamationCircleOutlined style={{ color: "red" }} />,
      content:
        "Após o cancelamento da reserva, a ocorrência estará disponível para nova inclusão.",
      onOk() {
        onCancelarReserva(observacao);
      },
      onCancel() {
        console.log("Cancel");
      },
    });
  }

  useEffect(() => {
    if (ocorrencia === null) {
      setLoading(true);
      getDadosOcorrenciaCancelar(idOcorrencia)
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

  const layout = {
    labelCol: { span: 10 },
    wrapperCol: { span: 12 },
  };

  return (
    <BBSpinning spinning={loading}>
      <Row gutter={[20, 20]}>
        <Col span={11}>
          <Card>
            <Title level={5}>Instruções</Title>
            <Paragraph>
              Conforme Comunicados a Administradores 2021/09227083 (Divar) e
              2021/09229822 (Dirav) - CTR ESTORNO DE VALORES, de 29/07/2021,
              após o efetivo pagamento do estorno de tarifas, é necessário
              incluir no formulário ao lado o comprovante de pagamento da
              operação.
            </Paragraph>
            <Paragraph>
              Para os casos de pagamento em <Text strong>espécie</Text>, os
              comprovantes de pagamento devem ser XPTO, XPTO, XPTO.
            </Paragraph>
            <Paragraph>
              Para os casos de pagamento em <Text strong>conta corrente</Text>,
              os comprovantes de pagamento devem ser XPTO, XPTO, XPTO.
            </Paragraph>
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
              <Row>
                <Col span={24}>
                  <Form {...layout} labelAlign="left">
                    <Form.Item wrapperCol={24}>
                      <TextArea
                        onBlur={(e) => {
                          setObservacao(e.target.value);
                        }}
                        placeholder="Motivo do cancelamento"
                        rows={10}
                      />
                    </Form.Item>
                    <Form.Item name="enviar" valuePropName="enviar">
                      <Button
                        type="primary"
                        danger
                        onClick={confirmarCancelamento}
                      >
                        Cancelar Reserva
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
              </Row>
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

export default CancelarReserva;
