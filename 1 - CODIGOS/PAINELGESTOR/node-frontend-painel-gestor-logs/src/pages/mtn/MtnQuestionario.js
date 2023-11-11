import React, { Component } from "react";
//Redux Dependencies
import {
  fetchQuestionario,
  respondeQuestionario,
  enviarQuestionario,
  fetchQuestionarioAdm,
} from "services/ducks/Mtn.ducks";
import { connect } from "react-redux";
import PageLoading from "components/pageloading/PageLoading";
import { LeftOutlined, LoadingOutlined } from "@ant-design/icons";
import {
  message,
  Form,
  Select,
  Button,
  Typography,
  Spin,
  Result,
  Row,
  Col,
  Input,
  Alert,
  Radio,
  Descriptions,
} from "antd";
import { Link } from "react-router-dom";
import { debounce } from "throttle-debounce";
import styled from "styled-components";
import ListaMatriculas from "components/listaMatriculas/ListaMatriculas";
import SimNao from "components/mtn/SimNaoJustificativa";

const tiposPergunta = {
  TEXTO_LONGO: 1,
  NUMERO: 2,
  SIM_NAO: 3,
  FRUTAS: 4,
  OPCOES_OUROCAP: 9,
  TEXTO_CURTO: 5,
  OPCOES: 6,
  LISTA_MATRICULAS: 7,
  SIM_NAO_S_JUST: 8,
  OPCOES_9: 9,
};

const SELECT_GENERICO = "SELECT_GENERICO";

// === Ant design Alias ===

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

// === Styled Components ===

const FormContainer = styled.div`
  padding-bottom: 20px;
  margin-top: 20px;
`;

class MtnQuestionario extends Component {
  state = {
    idResposta: "",
    loading: true,
    perguntas: {},
    errorMsg: "",
  };

  constructor(props) {
    super(props);
    this.onChangeDebounced = debounce(100, this.props.respondeQuestionario);
  }

  enviarQuestionario = () => {
    const responseHandler = {
      successCallback: () => {
        message.success("Questionário salvo com sucesso");
        this.setState({ loading: true }, () => {
          this.props.fetchQuestionario({
            idResposta: this.state.idResposta,
            responseHandler: {
              successCallback: () => {
                this.setState({ loading: false });
              },
              errorCallback: () => {
                console.log("Error callback fetchQuestionário");
                this.setState({ loading: false });
              },
            },
          });
        });
      },
      errorCallback: (errorMsg) => {
        message.error(
          errorMsg ? errorMsg.message : "Erro ao enviar questionário"
        );
      },
    };

    this.setState({ loading: true });
    this.props.enviarQuestionario(responseHandler);
  };

  renderPergunta = (resposta) => {
    let tipo = resposta.pergunta.tipo.id_tipo;
    let elem = null;
    const disabled =
      this.props.questionario.jaRespondeu ||
      this.props.questionario.finalizadoAutomaticamente;

    if (resposta.pergunta.tipo.nome === SELECT_GENERICO) {
      elem = (
        <Select
          defaultValue={resposta.resposta}
          disabled={disabled}
          onChange={(value) => {
            this.props.respondeQuestionario({
              value,
              idResposta: resposta.id_resposta,
              idPergunta: resposta.id_pergunta,
            });
          }}
          style={{ width: "100%" }}
        >
          {JSON.parse(resposta.pergunta.tipo.opcoes).map((opcao) => {
            return <Option value={opcao}>{opcao}</Option>;
          })}
        </Select>
      );
    } else {
      switch (tipo) {
        case tiposPergunta.LISTA_MATRICULAS:
          elem = (
            <ListaMatriculas
              disabled={disabled}
              value={resposta.resposta}
              updateFunc={(novaLista) => {
                this.props.respondeQuestionario({
                  value: novaLista
                    .map((elem) => (elem.matricula ? elem.matricula : elem))
                    .join(","),
                  idResposta: resposta.id_resposta,
                  idPergunta: resposta.id_pergunta,
                });
              }}
            />
          );
          break;
        case tiposPergunta.TEXTO_LONGO:
          elem = (
            <TextArea
              defaultValue={resposta.resposta}
              disabled={disabled}
              onBlur={(evt) =>
                this.props.respondeQuestionario({
                  value: evt.target.value,
                  idResposta: resposta.id_resposta,
                  idPergunta: resposta.id_pergunta,
                })
              }
              rows={4}
            />
          );
          break;
        case tiposPergunta.NUMERO:
          elem = (
            <Input
              defaultValue={resposta.resposta}
              disabled={disabled}
              onBlur={(evt) =>
                this.props.respondeQuestionario({
                  value: evt.target.value,
                  idResposta: resposta.id_resposta,
                  idPergunta: resposta.id_pergunta,
                })
              }
            />
          );
          break;

        case tiposPergunta.SIM_NAO_S_JUST:
          elem = (
            <Radio.Group
              defaultValue={resposta.resposta}
              disabled={this.props.questionario.jaRespondeu}
              onChange={(evt) =>
                this.props.respondeQuestionario({
                  value: evt.target.value,
                  idResposta: resposta.id_resposta,
                  idPergunta: resposta.id_pergunta,
                })
              }
              buttonStyle="solid"
            >
              <Radio.Button value="SIM">Sim</Radio.Button>
              <Radio.Button value="NAO">Não</Radio.Button>
            </Radio.Group>
          );
          break;

        case tiposPergunta.SIM_NAO:
          elem = (
            <SimNao
              defaultValue={resposta.resposta}
              justificativa
              disabled={disabled}
              onChange={(value) =>
                this.props.respondeQuestionario({
                  value: value,
                  idResposta: resposta.id_resposta,
                  idPergunta: resposta.id_pergunta,
                })
              }
              buttonStyle="solid"
            />
          );

          break;

        case tiposPergunta.FRUTAS:
        case tiposPergunta.OPCOES_OUROCAP:
        case tiposPergunta.OPCOES:
          elem = (
            <Select
              defaultValue={resposta.resposta}
              disabled={disabled}
              onChange={(value) => {
                this.props.respondeQuestionario({
                  value,
                  idResposta: resposta.id_resposta,
                  idPergunta: resposta.id_pergunta,
                });
              }}
              style={{ width: "100%" }}
            >
              {JSON.parse(resposta.pergunta.tipo.opcoes).map((opcao) => {
                return <Option value={opcao}>{opcao}</Option>;
              })}
            </Select>
          );

          break;

        case tiposPergunta.TEXTO_CURTO:
          elem = (
            <Input
              defaultValue={resposta.resposta}
              disabled={disabled}
              onBlur={(evt) =>
                this.props.respondeQuestionario({
                  value: evt.target.value,
                  idResposta: resposta.id_resposta,
                  idPergunta: resposta.id_pergunta,
                })
              }
            />
          );
          break;
        default:
          message.error(
            `Tipo de pergunta ${resposta.nome} não implementado. Favor contatar o administrador do sistema`
          );
          break;
      }
    }

    return <Form.Item label={resposta.pergunta.nome}> {elem} </Form.Item>;
  };

  componentDidMount() {
    if (!this.props.admin) {
      this.setState({ idResposta: this.props.match.params.id }, () => {
        this.props.fetchQuestionario({
          idResposta: this.state.idResposta,
          responseHandler: {
            successCallback: () => {
              this.setState({ loading: false });
            },
            errorCallback: (error) => {
              if (error.status === 403) {
                this.setState({
                  errorMsg: "Usuário não é o público alvo desta pergunta",
                  loading: false,
                });
              }
            },
          },
        });
      });
    } else {
      this.setState({ idResposta: this.props.match.params.id }, () => {
        this.props.fetchQuestionario({
          idResposta: this.state.idResposta,
          responseHandler: {
            successCallback: () => {
              this.setState({ loading: false });
            },
            errorCallback: (error) => {
              if (error.status === 403) {
                this.setState({
                  errorMsg: "Usuário não é o público alvo desta pergunta",
                  loading: false,
                });
              }
            },
          },
        });
      });
    }
  }

  render() {
    if (this.state.loading) {
      return <PageLoading />;
    }

    if (this.state.errorMsg !== "") {
      return (
        <Row type="flex" justify="center" align="top">
          <Col span={24}>
            <Result
              status="403"
              title="403"
              subTitle={<Text type="danger">{this.state.errorMsg}</Text>}
              extra={
                <Link to={"/mtn/minhas-ocorrencias/"}>
                  <Button type="primary" icon={<LeftOutlined />}>
                    Retornar
                  </Button>
                </Link>
              }
            />
          </Col>
        </Row>
      );
    }

    let arrayForm = [];
    for (let resposta of this.props.questionario.respostas) {
      arrayForm.push(this.renderPergunta(resposta));
    }
    const formItemLayout = {
      labelAlign: "left",
      labelCol: {
        offset: 1,
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 24 },
      },
    };

    return (
      <FormContainer>
        <Spin indicator={antIcon} spinning={this.state.loading}>
          <Row gutter={[0, 20]}>
            <Col span={24}>
              <Title level={2}> {this.props.questionario.titulo} </Title>
            </Col>
            {this.props.questionario.dadosQuestionario && (
              <Col span={24}>
                <Descriptions column={1} bordered style={{ marginBottom: 20 }}>
                  <Descriptions.Item label="Visão">
                    {this.props.questionario.dadosQuestionario.visao &&
                    this.props.questionario.dadosQuestionario.visao.origem_visao
                      ? this.props.questionario.dadosQuestionario.visao
                          .origem_visao
                      : "Não informado"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Descrição">
                    {this.props.questionario.dadosQuestionario.desc_ocorrencia
                      ? this.props.questionario.dadosQuestionario
                          .desc_ocorrencia
                      : "Não informado"}
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            )}
            <Col span={24}>
              {this.props.questionario.finalizadoAutomaticamente && (
                <Alert
                  message="Este formulário foi encerrado automaticamente pelo sistema."
                  type="error"
                />
              )}

              <Form size="middle" layout="vertical" {...formItemLayout}>
                {arrayForm.map((elem) => (
                  <Form.Item> {elem} </Form.Item>
                ))}
                {!this.props.questionario.jaRespondeu && (
                  <Form.Item>
                    <Button
                      type="primary"
                      onClick={this.enviarQuestionario}
                      htmlType="submit"
                    >
                      Registrar Resposta
                    </Button>
                  </Form.Item>
                )}
              </Form>
            </Col>
          </Row>
        </Spin>
        <Link to={"/mtn/minhas-ocorrencias/"}>
          <Button type="primary" icon={<LeftOutlined />}>
            Retornar
          </Button>
        </Link>
      </FormContainer>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    questionario: state.mtn.questionario,
  };
};

export default connect(mapStateToProps, {
  fetchQuestionario,
  fetchQuestionarioAdm,
  respondeQuestionario,
  enviarQuestionario,
})(MtnQuestionario);
