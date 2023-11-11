import React, { Component } from "react";
//Redux
import { connect } from "react-redux";
import {
  fetchQuestionariosAdm,
  fetchLogsAcesso,
  fetchMtns,
} from "services/ducks/Mtn.ducks";
import { toggleSideBar } from "services/actions/commons";
import { RedoOutlined } from "@ant-design/icons";
import { Tabs, message, Row, Col, Button, Typography } from "antd";
import InteracoesPendentes from "components/mtn/InteracoesPendentes";
import MtnEmAndamento from "components/mtn/MtnEmAndamento";
import MtnFinalizados from "components/mtn/MtnFinalizados";
import NotificacoesFilaEnvio from "components/mtn/NotificacoesFilaEnvio";
import MtnPendentesSuper from "components/mtn/MtnPendentesSuper";
import styled from "styled-components";
import uuid from "uuid/v4";
import AccessDenied from "pages/errors/AccessDenied";
const { TabPane } = Tabs;
const {Text} = Typography;
// === Styled Components ===

const TabContainer = styled.div`
  padding: 20px 0;
`;

class MtnAdministrarOcorrencias extends Component {
  state = {
    loading: true,
    fetching: {
      emAndamento: false,
      finalizados: false,
      interacoesPendentes: false,
      notAllowed: true,
    },
    mtnFinalizadosKey: uuid(),
  };

  componentDidMount() {
    if (!this.props.sideBarCollapsed) {
      this.props.toggleSideBar();
    }
    this.fetchQuestionarios();
  }

  /** FETCHING METHODS */

  // fetchMtns = (tipo) => {
  //   let newState = _.clone(this.state);
  //   _.set(newState, ["fetching", tipo], true);
  //   this.setState({ ...newState }, () => {
  //     this.props.fetchMtns({
  //       tipo,
  //       matricula: this.state.matricula,
  //       responseHandler: {
  //         successCallback: () => {
  //           _.set(newState, ["fetching", tipo], false);

  //           this.setState({ ...newState, loading: false });
  //         },

  //         errorCallback: (error) => {
  //           if (error.response.status === 403) {
  //             this.setState({ notAllowed: true, loading: false });
  //             message.error("Usuário não autorizado.");
  //             return;
  //           }
  //           message.error(
  //             "Erro ao recuperar lista de questionários. Tente novamente mais tarde."
  //           );
  //         },
  //       },
  //     });
  //   });
  // };

  fetchQuestionarios = () => {
    this.setState(
      { fetching: { ...this.state.fetching, interacoesPendentes: true } },
      () => {
        this.props.fetchQuestionariosAdm({
          responseHandler: {
            successCallback: () =>
              this.setState({
                fetching: {
                  ...this.state.fetching,
                  interacoesPendentes: false,
                },
                loading: false,
              }),
            errorCallback: (error) => {
              if (error.response.status === 403) {
                this.setState({ notAllowed: true, loading: false });
                message.error("Usuário não autorizado.");
                return;
              }
              message.error(
                "Erro ao recuperar lista de questionários. Tente novamente mais tarde."
              );
            },
          },
        });
      }
    );
  };

  /** RENDER METHODS */

  renderReloadButton = (tipo, reloadFunc) => {
    return (
      <Row style={{ marginBottom: "15px" }}>
        <Col span={24} style={{ textAlign: "right" }}>
          <Button
            icon={<RedoOutlined />}
            style={{ marginLeft: "15px" }}
            loading={this.state.fetching[tipo]}
            onClick={reloadFunc}
          />
        </Col>
      </Row>
    );
  };

  render() {
    if (this.state.notAllowed) {
      return (
        <AccessDenied nomeFerramenta={"MTN"} extraText={"Usuário sem acesso"} />
      );
    }
    return (
      <>
      <div style={{ marginBottom: 20}}>
        <Text strong>#confidencial</Text>
      </div>
      <Tabs type="card">
        <TabPane tab="Pendências Super" key="ocorrencias_pendencia_super">
          <TabContainer>
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <MtnPendentesSuper />
              </Col>
            </Row>
          </TabContainer>
        </TabPane>
        <TabPane tab="Em andamento" key="ocorrencias_em_andamento">
          <TabContainer>
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <MtnEmAndamento
                  mtns={this.props.emAndamento}
                  fetching={this.state.fetching.emAndamento}
                />
              </Col>
            </Row>
          </TabContainer>
        </TabPane>

        <TabPane tab="Concluídas" key="ocorrencias_concluidas">
          <TabContainer>
            {this.renderReloadButton("finalizados", () =>
              this.setState({ mtnFinalizadosKey: uuid() })
            )}
            <Row>
              <Col span={24} style={{ textAlign: "right" }}>
                <MtnFinalizados
                  key={this.state.mtnFinalizadosKey}
                  mtns={this.props.finalizados}
                  fetching={this.state.fetching.finalizados}
                />
              </Col>
            </Row>
          </TabContainer>
        </TabPane>
        <TabPane tab="Interações Pendentes" key="interacoes_pendentes">
          <TabContainer>
            <InteracoesPendentes
              questionarios={this.props.questionarios}
              logs={this.props.logs}
              fetching={this.state.fetching.interacoesPendentes}
              fetchQuestionarios={this.fetchQuestionarios}
              fetchLogsAcesso={this.props.fetchLogsAcesso}
            />
          </TabContainer>
        </TabPane>
        <TabPane tab="Notificações" key="notificacoes_com_problema">
          <TabContainer>
            <NotificacoesFilaEnvio />
          </TabContainer>
        </TabPane>
      </Tabs>
      </>
    );
  }
}

const mapStateToProps = ({ mtn, app }) => {
  return {
    emAndamento: mtn.admOcorrencias.analises.emAndamento,
    finalizados: mtn.admOcorrencias.analises.finalizados,
    questionarios: mtn.admOcorrencias.questionarios,
    logs: mtn.admOcorrencias.logsAcesso,
    sideBarCollapsed: app.sideBarCollapsed,
  };
};

export default connect(mapStateToProps, {
  toggleSideBar,
  fetchQuestionariosAdm,
  fetchMtns,
  fetchLogsAcesso,
})(MtnAdministrarOcorrencias);
