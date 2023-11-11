import React, { Component } from 'react';
import { LoadingOutlined } from '@ant-design/icons';
import {
  Row,
  Col,
  Affix,
  Tabs,
  Avatar,
  Spin,
  Card,
  Divider,
  Button,
  Typography,
  Space,
  Badge,
} from 'antd';

import MtnModalEnvolvido from 'components/mtn/MtnModalEnvolvido';
import StyledCard from 'components/styledcard/StyledCardPrimary';
import styled from 'styled-components';
import { getProfileURL } from 'utils/Commons';
import MtnEnvolvidoHistorico from 'components/mtn/MtnEnvolvidoHistorico';
import MtnEsclarecimentos from 'components/mtn/MtnEsclarecimentos';
import MtnFormParecer from 'components/mtn/MtnFormParecer';
import MtnParecer from 'components/mtn/MtnParecer';
import MtnNotasInternas from 'components/mtn/MtnNotasInternas';
import MtnTimeline from 'components/mtn/MtnTimeline';
import DepCargo from 'components/mtn/DepCargo';
import MtnImpedimentos from 'components/mtn/MtnImpedimentos';
import MtnRecurso from 'components/mtn/MtnRecurso';
import {
  incluirEnvolvido,
  fetchDadosEnvolvidos,
  types,
  getEnvolvido,
} from 'services/ducks/Mtn.ducks';
import { connect } from 'react-redux';
import BtnLogsEnvolvidos from './BtnLogsEnvolvidos';
import BtnAusenciasEnvolvidos from './BtnAusenciasEnvolvidos';

import HistoricoAlteracaoMedidas from './HistoricoAlteracaoMedidas';
import MtnEnvolvidosMudarVersao from './MtnEnvolvidosMudarVersao';

const { TabPane } = Tabs;
const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const { Text } = Typography;
const AffixWrapper = styled.div`
  & .ant-affix {
    & .ant-tabs-nav-wrap {
      background-color: #ffffff;
    }
  }
`;

const AnimatedTab = styled.div`
  & .ant-card {
    opacity: 1;
    transition: opacity 0.2s;
    &.mudando {
      opacity: 0;
    }
  }
`;

const Margins = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
  & .ant-tabs-top > .ant-tabs-nav {
    margin: 0px;
  }
`;

class MtnEnvolvidos extends Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    loading: false,
    envolvidoAtual: 0, // índice do envolvido atual,
    visibleModal: false,
    classCard: '',
    notasInternasNaoLidas: 0,
  };

  componentDidMount() {
    const { envolvidos } = this.props;

    const { search } = window.location;
    const queryParams = new URLSearchParams(search);

    const envolvidoAtual = queryParams.get('envolvidoAtual');

    if (envolvidoAtual) {
      const envolvidoSolicitado = envolvidos.findIndex(
        (envolvido) => envolvido.matricula === envolvidoAtual,
      );

      this.setState({ envolvidoAtual: envolvidoSolicitado });
      return;
    }

    const primeiroPendenteSuper = envolvidos.findIndex(
      (envolvido) =>
        !envolvido.pendenteEnvolvido && envolvido.respondidoEm === null,
    );

    if (primeiroPendenteSuper >= 0) {
      this.setState({ envolvidoAtual: primeiroPendenteSuper });
      return;
    }

    this.setState({ envolvidoAtual: 0 });

    if (envolvidos.length) {
      this.calcularQtdeNotaNaoLida(this.state.envolvidoAtual);
    }
  }

  calcularQtdeNotaNaoLida = (envolvidoAtual) => {
    this.atualizaNotaNaoLida(
      this.props.envolvidos[envolvidoAtual].notasInternas.length -
        this.props.envolvidos[envolvidoAtual].notasInternasLidas.length,
    );
  };

  atualizaNotaNaoLida = (qtde) => {
    this.setState({ notasInternasNaoLidas: qtde });
  };

  renderAreaParecer = (envolvido) => {
    const possuiRecursoPendente =
      envolvido.recursos.findIndex(
        (elem) => elem.reveliaEm === null && elem.respondidoEm === null,
      ) >= 0;

    return (
      <>
        <Space style={{ marginBottom: 20 }}>
          <Button
            type="primary"
            onClick={() => {
              window.open(
                `../people-analitics/${envolvido.idEnvolvido}`,
                'new',
                'width=1500,height=800',
              );
              return false;
            }}
          >
            People Analytics
          </Button>
          <Button
            type="primary"
            onClick={() => {
              window.open(
                `../questionario-info/${envolvido.idEnvolvido}/${envolvido.idMtn}`,
                'new',
                'width=1500,height=800',
              );
              return false;
            }}
          >
            Questionário
          </Button>
          <Button
            type="primary"
            onClick={() => {
              window.open(
                `../notificacoes/${envolvido.idEnvolvido}`,
                'new',
                'width=1500,height=800',
              );
              return false;
            }}
          >
            Notificações
          </Button>
          <BtnLogsEnvolvidos envolvido={envolvido} />
          <HistoricoAlteracaoMedidas envolvido={envolvido} />
          <BtnAusenciasEnvolvidos envolvido={envolvido} />
        </Space>

        {envolvido.respondidoEm || envolvido.pendenteAprovacao ? (
          <MtnParecer
            envolvido={envolvido}
            refreshEnvolvidos={this.refreshEnvolvidos}
          />
        ) : (
          <MtnFormParecer
            possuiRecursoPendente={possuiRecursoPendente || false}
            envolvidoAtual={envolvido}
            medidas={this.props.medidas}
            fileList={[]}
            readOnly={this.props.readOnly}
          />
        )}
      </>
    );
  };

  renderAreaRecurso = (envolvido) => {
    if (envolvido.recursos && envolvido.recursos.length > 0) {
      return (
        <MtnRecurso
          readOnly={this.props.readOnly}
          recursos={envolvido.recursos}
        />
      );
    }
    return null;
  };

  onChangeTab = (key) => {
    const index = parseInt(key.split('_')[1], 10);
    this.calcularQtdeNotaNaoLida(index);
    this.setState({ classCard: 'mudando', loading: true }, () => {
      setTimeout(() => {
        this.setState({ classCard: '', envolvidoAtual: index, loading: false });
      }, 200);
    });
  };

  renderAreaAnalise = () => {
    const envolvido = this.props.envolvidos[this.state.envolvidoAtual];
    const medidaSugerida = envolvido.medidaSugerida
      ? envolvido.medidaSugerida.txtMedida
      : 'Nenhuma';

    return (
      <AnimatedTab>
        <Card className={this.state.classCard}>
          <Row gutter={[0, 15]}>
            {envolvido.versaoIdOriginal !== null ||
            envolvido.versaoIdNova !== null ? (
              <Col span={24}>
                <MtnEnvolvidosMudarVersao
                  setLoading={(loadingValue, cb) =>
                    this.setState({ loading: loadingValue }, cb)
                  }
                  action={{
                    type: types.MUDAR_VERSAO_ENVOLVIDO,
                    payload: {
                      indiceParaAlterar: this.state.envolvidoAtual,
                    },
                  }}
                  fetchEnvolvido={(idEnvolvido) => getEnvolvido(idEnvolvido)}
                  envolvido={envolvido}
                />
              </Col>
            ) : null}

            <Col span={24}>
              <Divider style={{ marginBottom: '40px' }}>
                Monitoramentos do funcionário
              </Divider>
              <MtnEnvolvidoHistorico data={envolvido.historico} />
            </Col>
          </Row>
          <Row gutter={[0, 15]}>
            <Col span={11}>
              <DepCargo
                title="Dados à Época da ocorrência"
                cdCargo={envolvido.cdCargoEpoca}
                nomeCargo={envolvido.nomeCargoEpoca}
                cdPrefixo={envolvido.cdPrefixoEpoca}
                nomePrefixo={envolvido.nomePrefixoEpoca}
              />
            </Col>
            <Col span={11} offset={1}>
              <DepCargo
                title="Dados Atuais da ocorrência"
                cdCargo={envolvido.cdCargoAtual}
                nomeCargo={envolvido.nomeCargoAtual}
                cdPrefixo={envolvido.cdPrefixoAtual}
                nomePrefixo={envolvido.nomePrefixoAtual}
              />
            </Col>
          </Row>

          <Row gutter={[0, 15]}>
            <Col span={24}>
              <Divider orientation="left">Esclarecimentos</Divider>
              <MtnEsclarecimentos
                visao="adm"
                envolvidoAtual={envolvido}
                esclarecimentos={envolvido.esclarecimentos}
                readOnly={this.props.readOnly}
              />
            </Col>

            <Col span={24}>
              <Margins>
                <Tabs type="card">
                  {/* <Tabs type="card"> */}
                  <TabPane tab="Parecer" key="parecer">
                    <Margins>
                      <Text strong> Medida Sugerida:</Text>
                      <Text>{medidaSugerida}</Text>
                    </Margins>
                    <Margins>{this.renderAreaParecer(envolvido)}</Margins>
                    <Margins>{this.renderAreaRecurso(envolvido)}</Margins>
                  </TabPane>
                  <TabPane
                    style={{ backgroundColor: '#f0f0f0', paddingTop: 0 }}
                    tab={
                      <>
                        Notas Internas {`(${envolvido.notasInternas.length})`}
                        <Badge
                          count={this.state.notasInternasNaoLidas}
                          size="small"
                          offset={[8, -20]}
                        />
                      </>
                    }
                    key="notas-internas"
                  >
                    <Margins>
                      <MtnNotasInternas
                        atualizaNotaNaoLida={this.atualizaNotaNaoLida}
                        notasInternasLidas={envolvido.notasInternasLidas}
                        idEnvolvido={envolvido.idEnvolvido}
                      />
                    </Margins>
                  </TabPane>
                </Tabs>
              </Margins>
            </Col>

            <Col span={11}>
              <Divider orientation="left">Impedimentos</Divider>
              <MtnImpedimentos impedimentos={envolvido.impedimentos} />
            </Col>
            <Col span={11} offset={1}>
              <Divider orientation="left" style={{ marginBottom: '20px' }}>
                Linha do Tempo
              </Divider>
              <MtnTimeline timeline={envolvido.timeline} />
            </Col>
          </Row>
        </Card>
      </AnimatedTab>
    );
  };

  renderTabs = (envolvidos) => {
    const tabEnvolvidos = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < envolvidos.length; i++) {
      const envolvido = envolvidos[i];
      tabEnvolvidos.push(
        <TabPane
          disabled={this.state.loading}
          tab={
            <span>
              <Spin spinning={this.state.loading} indicator={antIcon}>
                <Avatar
                  style={{ cursor: 'pointer' }}
                  src={getProfileURL(envolvido.matricula)}
                />

                <Text
                  style={
                    !envolvido.pendenteEnvolvido &&
                    envolvido.respondidoEm === null
                      ? { color: 'red' }
                      : {}
                  }
                >
                  {`${envolvido.matricula} - ${envolvido.nomeFunci}`}
                </Text>
              </Spin>
            </span>
          }
          key={`envolvido_${i}`}
        />,
      );
    }

    return tabEnvolvidos;
  };

  showModal = () => {
    this.setState({
      visibleModal: true,
    });
  };

  closeModal = (e) => {
    this.setState({
      visibleModal: false,
    });
  };

  renderAffix = () => (
    <span>
      <AffixWrapper>
        <Affix>
          <Tabs
            tabPosition="top"
            activeKey={`envolvido_${this.state.envolvidoAtual}`}
            // fixed
            onChange={(key) => this.onChangeTab(key)}
          >
            {this.renderTabs(this.props.envolvidos)}
          </Tabs>
        </Affix>
      </AffixWrapper>
      {this.renderAreaAnalise()}
    </span>
  );

  refreshEnvolvidos = () => {
    this.closeModal();
    this.setState({ loading: true }, () => {
      this.setState({ loading: true }, () => {
        this.props.fetchDadosEnvolvidos({
          idMtn: this.props.idMtn,
          responseHandler: {
            successCallback: () => this.setState({ loading: false }),
            errorCallback: () =>
              console.log('Erro ao recuperar dados do envolvido'),
          },
        });
      });
    });
  };

  render() {
    return (
      <>
        <StyledCard
          type="flex"
          title="Envolvidos"
          style={{ marginTop: '20px' }}
          extra={
            !this.props.readOnly && (
              <Button
                disabled={this.state.loading}
                type="secondary"
                onClick={this.showModal}
              >
                Incluir envolvido
              </Button>
            )
          }
          noShadow={false}
        >
          {this.props.envolvidos.length > 0 ? this.renderAffix() : ''}
        </StyledCard>
        <MtnModalEnvolvido
          matriculasEnvolvidos={this.props.envolvidos.map(
            (envolvido) => envolvido.matricula,
          )}
          handleCancel={this.closeModal}
          handleOk={this.props.incluirEnvolvido}
          refreshEnvolvidos={this.refreshEnvolvidos}
          visibleModal={this.state.visibleModal}
          idMtn={this.props.idMtn}
        />
      </>
    );
  }
}

export default connect(null, {
  incluirEnvolvido,
  fetchDadosEnvolvidos,
})(MtnEnvolvidos);
