import React, { Component } from 'react';
//  Redux Dependencies
import { connect } from 'react-redux';
import {
  fetchMeuMtn,
  downloadAnexo,
  prorrogarEsclarecimento,
  responderRecurso,
  types,
  getMeuMtn,
} from 'services/ducks/Mtn.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import ListaAnexos from 'components/listaAnexos/ListaAnexos';
import { Link } from 'react-router-dom';
import { ArrowLeftOutlined, QuestionCircleTwoTone } from '@ant-design/icons';
import {
  message,
  Row,
  Col,
  Divider,
  Card,
  Empty,
  Collapse,
  Typography,
  Descriptions,
  Button,
  Result,
  Tooltip,
  Tag,
} from 'antd';
import ReactHtmlParser from 'react-html-parser';
import StyledCard from 'components/styledcard/StyledCardPrimary';
import DepCargo from 'components/mtn/DepCargo';
import MtnFormEsclarecimento from 'components/mtn/MtnFormEsclarecimento';
import MtnTimeline from 'components/mtn/MtnTimeline';
/* Custom Components */
import MtnDadosBasicos from 'components/mtn/MtnDadosBasicos';
import constants from 'utils/Constants';
import { capitalizeName } from 'utils/Commons';
import MtnEnvolvidosMudarVersao from 'components/mtn/MtnEnvolvidosMudarVersao';
import FormInteracao from '../../components/mtn/FormInteracao';


const { MTN } = constants;
const { Title } = Typography;
const { Panel } = Collapse;
const { Text } = Typography;

const prazoRespostaEsclarecimento = 5;
const prazoProrrogacao = 10;

class MeuMtn extends Component {
  state = {
    idMtn: this.props.match.params.idMtn,
    loading: true,
    forbbiden: false,
    loadingEsclarecimento: false,
  };

  componentDidMount() {
    this.props.fetchMeuMtn({
      idMtn: this.state.idMtn,
      responseHandler: {
        successCallback: () => this.setState({ loading: false }),
        errorCallback: (error) => this.handleErrorFetch(error),
      },
    });
  }

  handleErrorFetch = (error) => {
    if (error.status === 403) {
      this.setState({ loading: false, forbbiden: true });
      message.error('Usuário sem acesso a esta ocorrência');
    }
  };

  renderAreaParecer = () => {
    const {
      respondidoEm,
      txtAnalise,
      respAnalise,
      pendenteRecurso,
      medidaSelecionada,
    } = this.props.dadosMtn.dadosEnvolvido;
    const areaParecer = [];
    const recurso = this.props.dadosMtn.dadosEnvolvido.recursosMeuMtn[0];
    // Caso esteja pendente de recurso ou não está pendente e ainda não foi respondido
    if (recurso) {
      areaParecer.push(
        <Card style={{ marginBottom: 20 }} title="Recurso">
          <Row gutter={[0, 15]}>
            <Col span={7}>
              <Text strong>Data do Parecer:</Text>
            </Col>
            <Col span={17}>
              <Text>{recurso.dataCriacao}</Text>
            </Col>

            {!recurso.respondidoEm && (
              <>
                <Col span={7}>
                  <Text strong>Prazo para resposta:</Text>
                </Col>

                <Col span={17}>
                  <Tooltip
                    placement="topRight"
                    title="Qtd. dias Transcorridos / Prazo Total"
                  >
                    <Text style={{ display: 'inline-block', marginRight: 10 }}>
                      {' '}
                      {recurso.qtdDiasTrabalhados} / {MTN.prazoMaxRecurso}
                    </Text>{' '}
                    <QuestionCircleTwoTone />
                  </Tooltip>
                </Col>
              </>
            )}
            <Col span={7}>
              <Text strong>Resultado da Análise:</Text>
            </Col>
            <Col span={17}>
              <Text>{recurso.medida.txtMedida}</Text>
            </Col>

            <Col span={7}>
              <Text strong>Texto do Parecer:</Text>
            </Col>
            <Col span={17}>
              <Text>{recurso.txtParecer}</Text>
            </Col>
            {recurso.anexosParecer && recurso.anexosParecer.length > 0 && (
              <>
                <Col span={10}>
                  <Text strong>Anexos da Análise: </Text>
                </Col>
                <Col span={12}>
                  <div style={{ marginTop: 10, marginBottom: 10 }}>
                    <ListaAnexos
                      downloadAnexo={this.props.downloadAnexo}
                      anexos={recurso.anexosParecer}
                    />
                  </div>
                </Col>
              </>
            )}

            {recurso.respondidoEm || recurso.reveliaEm ? (
              <Row style={{ marginTop: 20 }}>
                <Col span={24}>
                  <Row gutter={[0, 20]}>
                    <Col span={10}>
                      <Text strong>Recurso: </Text>
                    </Col>
                    <Col span={14}> {recurso.txtRecurso} </Col>
                    {recurso.anexos && recurso.anexos.length > 0 && (
                      <>
                        <Col span={10}>
                          <Text strong>Anexos do Recurso: </Text>
                        </Col>
                        <Col span={14}>
                          <div style={{ marginTop: 10, marginBottom: 10 }}>
                            <ListaAnexos
                              downloadAnexo={this.props.downloadAnexo}
                              anexos={recurso.anexos}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                    {recurso.respondidoEm && (
                      <>
                        <Col span={10}>
                          <Text strong>Respondido Em: </Text>
                        </Col>
                        <Col span={14}> {recurso.respondidoEm} </Col>
                      </>
                    )}
                    {recurso.reveliaEm && (
                      <>
                        <Col span={10}>
                          <Text strong>Finalizado Em: </Text>
                        </Col>
                        <Col span={14}> {recurso.reveliaEm} </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </Row>
            ) : (
              <Col span={24}>
                <FormInteracao
                  title="Recurso"
                  saveButtonTxt="Salvar Recurso"
                  downloadFunc={(formData) =>
                    this.props.responderRecurso(formData)
                  }
                  submitFunc={(formData) =>
                    this.props.responderRecurso(formData)
                  }
                  identificador={recurso.id}
                  onSuccess={() =>
                    message.success('Recurso respondido com sucesso!')
                  }
                  onError={() => message.error('Erro ao salvar o recurso!')}
                />
              </Col>
            )}
          </Row>
        </Card>,
      );
    }

    //Caso já tenha sido respondido
    if (respondidoEm) {
      areaParecer.push(
        <div>
          <div style={{ marginBottom: 15 }}>
            <Descriptions bordered>
              <Descriptions.Item span={12} label="Analisado por">
                {respAnalise}
              </Descriptions.Item>
              <Descriptions.Item span={12} label="Analisado em">
                {respondidoEm}
              </Descriptions.Item>
              <Descriptions.Item span={12} label="Medida Selecionada">
                {medidaSelecionada}
              </Descriptions.Item>
              <Descriptions.Item span={12} label="Análise">
                <div style={{ whiteSpace: 'pre-line' }}>{txtAnalise}</div>
              </Descriptions.Item>
            </Descriptions>
          </div>
          <div>
            <ListaAnexos
              downloadAnexo={this.props.downloadAnexo}
              anexos={
                this.props.dadosMtn.dadosEnvolvido.anexos
                  ? this.props.dadosMtn.dadosEnvolvido.anexos
                  : []
              }
            />
          </div>
        </div>,
      );
    }

    //Caso ainda esteja pendente
    if (!respondidoEm && !pendenteRecurso) {
      areaParecer.push(
        <Card style={{ marginTop: 15 }}>
          <Empty
            description="A analisar"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>,
      );
    }
    return areaParecer;
  };

  // eslint-disable-next-line consistent-return
  esclarecimentoFormState = (esclarecimento) => {
    const rules = {
      prazoInicialNaoProrrogado: {
        check: (esclarecimento) =>
          esclarecimento.diasTrabalhados <= prazoRespostaEsclarecimento &&
          !esclarecimento.prorrogado,
        state: { podeProrrogar: true, podeResponder: true },
      },

      prazoInicialProrrogado: {
        check: (esclarecimento) =>
          esclarecimento.diasTrabalhados <= prazoRespostaEsclarecimento &&
          esclarecimento.prorrogado,
        state: { podeProrrogar: false, podeResponder: true },
      },

      prorrogado: {
        check: (esclarecimento) =>
          esclarecimento.diasTrabalhados > prazoRespostaEsclarecimento &&
          esclarecimento.diasTrabalhados <=
            prazoRespostaEsclarecimento + prazoProrrogacao &&
          esclarecimento.prorrogado,
        state: {
          podeProrrogar: false,
          podeResponder: true,
        },
      },

      vencido: {
        check: (esclarecimento) =>
          esclarecimento.diasTrabalhados >
            prazoRespostaEsclarecimento + prazoProrrogacao ||
          (esclarecimento.diasTrabalhados > prazoRespostaEsclarecimento &&
            !esclarecimento.prorrogado),
        state: {
          podeProrrogar: false,
          podeResponder: false,
          message:
            'Prazo de resposta expirado. Não é mais possível responder ao esclarecimento.',
        },
      },
    };

    // eslint-disable-next-line no-restricted-syntax
    for (const key in rules) {
      if (rules[key].check(esclarecimento)) {
        return { ...rules[key].state, tipo: key };
      }
    }
  };

  prorrogarEsclarecimento = (idEsclarecimento) => {
    this.setState({ loadingEsclarecimento: true }, () => {
      this.props.prorrogarEsclarecimento({
        idEsclarecimento,
        responseHandler: {
          successCallback: () => {
            this.props.fetchMeuMtn({
              idMtn: this.state.idMtn,
              responseHandler: {
                successCallback: () =>
                  this.setState({ loadingEsclarecimento: false }),
                errorCallback: (error) => this.handleErrorFetch(error),
              },
            });
          },
          errorCallback: () => console.log('Erro ao prorrogar'),
        },
      });
    });
  };

  renderEsclarecimentos = (esclarecimentos) => {
    if (esclarecimentos.length === 0) {
      return (
        <Card>
          <Empty
            description="Nenhum esclarecimento solicitado"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        </Card>
      );
    }

    const arrayEsclarecimentos = esclarecimentos.map(
      (esclarecimento, index) => {
        //  Significa que está finalizado
        if (esclarecimento.respondidoEm || esclarecimento.reveliaEm) {
          return (
            <Panel
              header={<Text>{esclarecimento.txtPedido}</Text>}
              key={`index`}
            >
              <Row>
                <Col span={24}>
                  <Text style={{ whiteSpace: 'pre-line' }}>
                    {esclarecimento.txtResposta}
                  </Text>
                </Col>
              </Row>
              <Row style={{ marginTop: 20 }}>
                <Col span={24}>
                  <Text type="secondary">
                    {esclarecimento.respondidoEm
                      ? `Respondido em: ${esclarecimento.respondidoEm}`
                      : `Finalizado em: ${esclarecimento.reveliaEm}`}
                  </Text>
                </Col>
              </Row>
              <Row>
                <Col span={5} style={{ marginTop: 20 }}>
                  <ListaAnexos
                    downloadAnexo={this.props.downloadAnexo}
                    anexos={esclarecimento.anexos}
                  />
                </Col>
              </Row>
            </Panel>
          );
        }

        const formState = this.esclarecimentoFormState(esclarecimento);
        const prazoTotal = esclarecimento.prorrogado
          ? prazoProrrogacao
          : prazoRespostaEsclarecimento;
        const prazoRestante = prazoTotal - esclarecimento.diasTrabalhados;

        let msgPrazo = null;
        if (prazoRestante === 0) {
          msgPrazo = (
            <Tag
              style={{ display: 'inline-block', marginLeft: 3 }}
              color="error"
            >
              Último dia para responder.
            </Tag>
          );
        } else if (prazoRestante > 0) {
          msgPrazo = (
            <Tag
              style={{ display: 'inline-block', marginLeft: 3 }}
              color="warning"
            >
              Prazo restante: {prazoRestante} dias trabalhados.
            </Tag>
          );
        } else {
          msgPrazo = (
            <Tag
              style={{ display: 'inline-block', marginLeft: 3 }}
              color="error"
            >
              O prazo para resposta expirou.
            </Tag>
          );
        }

        return (
          <Panel
            header={
              <Row>
                <Col
                  style={{ textAlign: 'justify', textJustify: 'inter-word' }}
                  xxl={20}
                  xl={15}
                  lg={12}
                >
                  <Text>{`${esclarecimento.txtPedido}`}</Text>
                </Col>
                <Col
                  style={{ textAlign: 'right', textJustify: 'inter-word' }}
                  xxl={4}
                  xl={9}
                  lg={12}
                >
                  {' '}
                  {msgPrazo}
                </Col>
              </Row>
            }
            key={index}
          >
            <Row style={{ marginTop: 20 }}>
              <Col span={24} style={{ marginBottom: 15 }}>
                {formState.podeProrrogar ? (
                  <Button
                    type="danger"
                    loading={this.state.loadingEsclarecimento}
                    size="small"
                    onClick={() =>
                      this.prorrogarEsclarecimento(esclarecimento.id)
                    }
                  >
                    Prorrogar prazo do esclarecimento
                  </Button>
                ) : (
                  ''
                )}
              </Col>
              <Col span={24}>
                {formState.podeResponder ? (
                  <MtnFormEsclarecimento
                    refreshMeuMtn={() => {
                      this.props.fetchMeuMtn({
                        idMtn: this.state.idMtn,
                        responseHandler: {
                          successCallback: () =>
                            this.setState({ loading: false }),
                          errorCallback: (error) =>
                            this.handleErrorFetch(error),
                        },
                      });
                    }}
                    loadingEsclarecimento={this.state.loadingEsclarecimento}
                    idEsclarecimento={esclarecimento.id}
                  />
                ) : (
                  <Text type="danger">{formState.message}</Text>
                )}
              </Col>
              <Col span={24} style={{ marginTop: 15 }}>
                <Text type="secondary">
                  Criado em: {esclarecimento.criadoEm}
                </Text>
              </Col>
            </Row>
          </Panel>
        );
      },
    );
    return (
      <Collapse accordion defaultActiveKey="0">
        {arrayEsclarecimentos}
      </Collapse>
    );
  };

  render() {
    if (this.state.loading) {
      return <PageLoading />;
    }

    if (this.state.forbbiden) {
      return (
        <Result
          status="error"
          title="Usuário não está envolvido nessa ocorrência."
          extra={
            <Link to="/mtn/minhas-ocorrencias/">
              <Button type="primary" icon={<ArrowLeftOutlined />}>
                Retornar às minhas ocorrências
              </Button>
            </Link>
          }
        />
      );
    }

    const {
      cdCargoAtual,
      nomeCargoAtual,
      cdPrefixoAtual,
      nomePrefixoAtual,
      cdCargoEpoca,
      nomeCargoEpoca,
      cdPrefixoEpoca,
      nomePrefixoEpoca,
      timelineMeuMtn,
      esclarecimentosMeuMtn,
    } = this.props.dadosMtn.dadosEnvolvido;
    return (
      <div>
        <MtnDadosBasicos
          dadosBasicos={{
            ...this.props.dadosMtn,
            ...this.props.dadosMtn.dadosPrefixo,
          }}
          esconderAvocar
        />
        <StyledCard
          type="flex"
          title="Descrição da ocorrência"
          noShadow={false}
        >
          <span>{ReactHtmlParser(this.props.dadosMtn.descOcorrencia)}</span>
        </StyledCard>

        <StyledCard type="flex" title="Dados MTN" noShadow={false}>
          <Row gutter={[0, 15]}>
            <Col span={24} style={{ textAlign: 'center' }}>
              <Title level={4}>
                Envolvido:{' '}
                {this.props.dadosMtn.dadosEnvolvido.matricula +
                  ' - ' +
                  capitalizeName(this.props.dadosMtn.dadosEnvolvido.nomeFunci)}
              </Title>
            </Col>
            <Col span={24}>
              <MtnEnvolvidosMudarVersao
                setLoading={(loadingValue, cb) => {
                  this.setState({ loading: loadingValue }, cb);
                }}
                action={{
                  type: types.MUDAR_VERSAO_MEU_ENVOLVIDO,
                  payload: {},
                }}
                envolvido={this.props.dadosMtn.dadosEnvolvido}
                fetchEnvolvido={(idEnvolvido) =>
                  getMeuMtn({
                    idMtn: this.state.idMtn,
                    idEnvolvido,
                  })                  
                }
              />
            </Col>
            <Col span={11}>
              <DepCargo
                title="Dados à Época da ocorrência"
                cdCargo={cdCargoEpoca}
                nomeCargo={nomeCargoEpoca}
                cdPrefixo={cdPrefixoEpoca}
                nomePrefixo={nomePrefixoEpoca}
              />
            </Col>
            <Col span={11} offset={1}>
              <DepCargo
                title="Dados Atuais da ocorrência"
                cdCargo={cdCargoAtual}
                nomeCargo={nomeCargoAtual}
                cdPrefixo={cdPrefixoAtual}
                nomePrefixo={nomePrefixoAtual}
              />
            </Col>
          </Row>
          <Row gutter={[0, 15]}>
            <Col span={11}>
              <Divider orientation="left" style={{ marginBottom: '30px' }}>
                Linha do Tempo
              </Divider>
              <Card>
                <Row type="flex" align="middle">
                  <Col span={24}>
                    <MtnTimeline timeline={timelineMeuMtn} />
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col span={11} offset={1}>
              <Divider orientation="left" style={{ marginBottom: '30px' }}>
                Parecer
              </Divider>
              {this.renderAreaParecer()}
            </Col>
          </Row>

          <Row gutter={[0, 15]}>
            <Col span={24}>
              <Divider orientation="left" style={{ marginBottom: '30px' }}>
                Esclarecimentos
              </Divider>

              <Row type="flex" align="middle">
                <Col span={24}>
                  {this.renderEsclarecimentos(esclarecimentosMeuMtn)}
                </Col>
              </Row>
            </Col>
          </Row>
        </StyledCard>
      </div>
    );
  }
}

const mapStateToProps = ({ mtn }) => ({
  dadosMtn: mtn.meuMtn.dadosMtn,
});

export default connect(mapStateToProps, {
  fetchMeuMtn,
  downloadAnexo,
  responderRecurso,
  prorrogarEsclarecimento,
})(MeuMtn);
