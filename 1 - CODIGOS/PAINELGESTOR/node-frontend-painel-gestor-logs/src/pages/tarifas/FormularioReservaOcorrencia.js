import React, { useState } from "react";
import {
  Row,
  Col,
  Steps,
  Button,
  message,
  Typography,
  Alert,
  Card,
} from "antd";
import FormContatos from "./FormContatos";
import FormPagamento from "./FormPagamento";
import AlfaSort from "utils/AlfaSort";
import SearchTable from "components/searchtable/SearchTable";
import { salvarReserva } from "services/ducks/Tarifas.ducks";
import { useParams } from "react-router-dom";
import { ESPECIE, CONTA_CORRENTE } from "./constants";

const { Step } = Steps;
const { Text, Paragraph, Title } = Typography;

const tiposPagamento = [ESPECIE, CONTA_CORRENTE];

const columns = [
  {
    dataIndex: "telefone",
    title: "Telefone",
    sorter: (a, b) => AlfaSort(a.id, b.id),
  },
  {
    dataIndex: "tipoContato",
    title: "Tipo",
    sorter: (a, b) => AlfaSort(a.id, b.id),
  },
  {
    dataIndex: "contato",
    title: "Contato",
    sorter: (a, b) => AlfaSort(a.id, b.id),
  },
];

const dadosIniciaisReserva = {
  contatos: [],
  dadosPagamento: {
    tipoPagamento: ESPECIE,
    nrBanco: null,
    agencia: null,
    conta: null,
    observacoes: null,
  },
};

const FormularioReservaOcorrencia = (props) => {
  const { idOcorrencia } = useParams();
  const [current, setCurrent] = useState(0);
  const [reserva, setReserva] = useState(dadosIniciaisReserva);

  const { loadingControl } = props;
  const { loading, setLoading } = loadingControl;

  const limparCampos = () => {
    setReserva(dadosIniciaisReserva);
  };

  const validarCampos = () => {
    return new Promise((resolve, reject) => {
      const erros = [];
      if (reserva.contatos.length === 0) {
        erros.push({ message: "Informe ao menos um contato" });
      }

      if (
        reserva.dadosPagamento.tipoPagamento === CONTA_CORRENTE &&
        (!reserva.dadosPagamento.nrBanco ||
          !reserva.dadosPagamento.agencia ||
          !reserva.dadosPagamento.conta)
      ) {
        erros.push({
          message:
            "Para pagamento em conta corrente, favor informe os dados de pagamento",
        });
      }

      return erros.length > 0 ? reject(erros) : resolve();
    });
  };

  const onSalvarReserva = () => {
    validarCampos()
      .then(() => {
        setLoading(true);
        salvarReserva(reserva, idOcorrencia)
          .then(() => {
            message.success("Salvo com sucesso.");
            limparCampos();
            setCurrent(0);
            props.recarregarOcorrencia();
          })
          .catch((error) => {
            message.error(error);
          })
          .then(() => {
            setLoading(false);
          });
      })
      .catch((erros) => {
        console.log(erros);
        for (const erro of erros) {
          message.error(erro.message);
        }
      });
  };

  const setDadosReserva = (campo, valor) => {
    setReserva({ ...reserva, [campo]: valor });
  };

  const steps = [
    {
      title: "Contatos",
      prox: async () => {
        return new Promise((resolve, reject) => {
          if (reserva.contatos.length === 0) {
            reject("Informe ao menos um contato");
          }
          resolve();
        });
      },
      content: (
        <Row>
          <Col span={24}>
            <FormContatos
              contatos={reserva.contatos}
              setContatos={(newContatos) =>
                setDadosReserva("contatos", newContatos)
              }
            />
          </Col>
        </Row>
      ),
    },
    {
      title: "Complemento",
      prox: async () => {
        return new Promise((resolve, reject) => resolve());
      },
      content: (
        <Row>
          <Col span={24}>
            <FormPagamento
              dadosPagamento={reserva.dadosPagamento}
              setDadosPagamento={(dadosPagamento) =>
                setReserva({ ...reserva, dadosPagamento })
              }
              tiposPagamento={tiposPagamento}
            />
          </Col>
        </Row>
      ),
    },
    {
      title: "Confirmar Reserva",
      prox: () => {
        return new Promise((resolve, reject) => resolve());
      },
      content: (
        <Row gutter={[0, 20]}>
          <Col offset={1} span={10}>
            <Paragraph>
              <Text strong>Método:</Text> {reserva.dadosPagamento.tipoPagamento}
            </Paragraph>
            {reserva.dadosPagamento.tipoPagamento === CONTA_CORRENTE ? (
              <>
                <Paragraph>
                  <Text strong>Nr. Banco:</Text>{" "}
                  {reserva.dadosPagamento.nrBanco}
                </Paragraph>
                <Paragraph>
                  <Text strong>Agência:</Text> {reserva.dadosPagamento.agencia}
                </Paragraph>
                <Paragraph>
                  <Text strong>Conta:</Text> {reserva.dadosPagamento.conta}
                </Paragraph>
                <Alert
                  message="Este pagamento será processado pelo CENOP"
                  type="warning"
                />
              </>
            ) : (
              <Alert
                message="Este pagamento deverá ser feito em um dos caixas localizados no mesmo prefixo do funcionário responsável por realizar a reserva"
                type="warning"
              />
            )}
          </Col>
          <Col offset={1} span={11}>
            <SearchTable
              pagination={{ pageSize: 3 }}
              columns={columns}
              dataSource={reserva.contatos}
            />
          </Col>
          <Col offset={1} span={23}>
            {reserva.dadosPagamento.observacoes && (
              <Card style={{ marginBottom: 20 }}>
                <Title level={5}>Observações</Title>
                <Paragraph>{reserva.dadosPagamento.observacoes}</Paragraph>
              </Card>
            )}
          </Col>
        </Row>
      ),
    },
  ];

  const next = async () => {
    await steps[current]
      .prox()
      .then(() => {
        setCurrent(current + 1);
      })
      .catch((msg) => {
        if (msg) {
          message.error(msg);
        }
      });
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  return (
    <Row>
      <Col span={24}>
        <>
          <Steps current={current}>
            {steps.map((item) => (
              <Step key={item.title} title={item.title} />
            ))}
          </Steps>
          <div style={{ minHeight: 300, paddingBottom: 15, paddingTop: 30 }}>
            {steps[current].content}
          </div>
          <div className="steps-action">
            {current > 0 && (
              <Button
                loading={loading}
                style={{ margin: "0 8px" }}
                onClick={() => prev()}
              >
                Anterior
              </Button>
            )}

            {current === steps.length - 1 && (
              <Button
                loading={loading}
                type="primary"
                onClick={onSalvarReserva}
              >
                Reservar para pagamento
              </Button>
            )}
            {current < steps.length - 1 && (
              <Button loading={loading} type="primary" onClick={() => next()}>
                Próximo
              </Button>
            )}
          </div>
        </>
      </Col>
    </Row>
  );
};

export default FormularioReservaOcorrencia;
