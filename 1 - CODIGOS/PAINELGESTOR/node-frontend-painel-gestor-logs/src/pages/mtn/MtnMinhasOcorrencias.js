import React, { Component } from "react";
//Redux Dependencies
import { connect } from "react-redux";
import PageLoading from "components/pageloading/PageLoading";
import { toggleSideBar } from "services/actions/commons";
import { Link } from "react-router-dom";
import StyledCard from "components/styledcard/StyledCardPrimary";
import AlfaSort from "utils/AlfaSort";
import SearchTable from "components/searchtable/SearchTable";
import { fetchOcorrencias } from "services/ducks/Mtn.ducks";
import { EditOutlined, RedoOutlined } from "@ant-design/icons";
import { Icon as LegacyIcon } from "@ant-design/compatible";
import { Tabs, message, Tooltip, Button, Row, Col, Spin } from "antd";
import styled from "styled-components";

const { TabPane } = Tabs;

const tiposOcorrencias = {
  EM_ANDAMENTO: "emAndamento",
  FINALIZADAS: "finalizadas",
};

const TabContainer = styled.div`
  padding: 20px 0;
`;

class MtnMinhasOcorrencias extends Component {
  columnsQuestionarios = [
    {
      dataIndex: "tipoDisplay",
      title: "Tipo",
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
    },
    {
      dataIndex: "visao",
      title: "Visão",
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
    },

    {
      dataIndex: "solicitante",
      title: "Solicitante",
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
    },
    {
      dataIndex: "dataNotificacao",
      title: "Data da notificação",
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
    },

    {
      dataIndex: "prazo",
      title: "Prazo",
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
      render: (text, record) => {
        return <span>{record.prazo}</span>;
      },
    },
    {
      title: "Ações",
      render: (text, record) => {
        let url = "";
        switch (record.tipo) {
          case "questionario":
            url = `/mtn/questionario/${record.id}`;

            break;
          case "esclarecimento":
            url = `/mtn/acompanhar/${record.id}`;

            break;
          case "recurso":
            console.log(record);
            url = `/mtn/acompanhar/${record.id}`;

            break;

          default:
            break;
        }

        return (
          <Tooltip placement="left" title="Responder">
            <Link to={url}>
              <EditOutlined className="link-color" />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  columnsMtns = [
    {
      dataIndex: "nrMtn",
      title: "Nr. MTN",
      sorter: (a, b) => AlfaSort(a.nrMtn, b.nrMtn),
    },
    {
      dataIndex: "status",
      title: "Status",
      sorter: (a, b) => AlfaSort(a.status, b.status),
    },
    {
      dataIndex: "prefixoEpoca",
      title: "Prefixo à época",
      sorter: (a, b) => AlfaSort(a.prefixoEpoca, b.prefixoEpoca),
    },
    {
      dataIndex: "cargoEpoca",
      title: "Cargo à época",
      sorter: (a, b) => AlfaSort(a.cargoEpoca, b.cargoEpoca),
    },
    {
      title: "Ações",
      render: (text, record) => {
        let finalizada = record.status === "Análise finalizada";
        return (
          <Tooltip
            placement="left"
            title={finalizada ? "Visualizar" : "Responder"}
          >
            <Link to={"/mtn/acompanhar/" + record.idMtn}>
              <LegacyIcon
                type={finalizada ? "eye" : "edit"}
                className="link-color"
              />
            </Link>
          </Tooltip>
        );
      },
    },
  ];

  //Inicialização do componente
  state = {
    loading: false,
    fetching: {
      emAndamento: true,
      finalizadas: true,
    },
  };

  getTableActions = (record) => {
    return (
      <Tooltip title={record.pendente ? "Responder" : "Visualizar Resposta"}>
        <Link to={"/mtn/questionario/" + record.idResposta}>
          <LegacyIcon
            type={record.pendente ? "edit" : "eye"}
            className="link-color"
          />
        </Link>
      </Tooltip>
    );
  };

  //Métodos fetch

  fetchOcorrencias = (tipo) => {
    this.props.fetchOcorrencias({
      tipo,
      responseHandler: {
        successCallback: (tipo) => {
          let newFetching = this.state.fetching;
          newFetching[tipo] = false;
          this.setState({ fetching: { ...newFetching } });
        },
        errorCallback: () =>
          message.error(
            "Não foi possível recuperar as ocorrências MTN do usuário"
          ),
      },
    });
  };

  updateTable = (tipo) => {
    let newFetching = { ...this.state.fetching };
    newFetching[tipo] = true;

    this.setState({ loading: false, fetching: { ...newFetching } }, () => {
      this.fetchOcorrencias(tipo);
    });
  };

  //LifeCycle methods

  componentDidMount() {
    if (!this.props.sideBarCollapsed) {
      this.props.toggleSideBar();
    }
    this.setState(
      { loading: false, fetching: { emAndamento: true, finalizadas: true } },
      () => {
        this.fetchOcorrencias(tiposOcorrencias.EM_ANDAMENTO);
        this.fetchOcorrencias(tiposOcorrencias.FINALIZADAS);
      }
    );
  }

  // Métodos Render

  renderTableMtns = (mtns) => {
    return (
      <span>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <SearchTable
              columns={this.columnsMtns}
              // loading={this.state.fetching.emAndamento}
              dataSource={mtns}
              size="small"
              pagination={{ showSizeChanger: true }}
            />
          </Col>
        </Row>
      </span>
    );
  };

  //Tipo pode ser pendentes ou respondidos
  renderTableOcorrencias(tipo) {
    let ocorrencias = [];
    switch (tipo) {
      case tiposOcorrencias.EM_ANDAMENTO:
        ocorrencias = this.props.emAndamento.interacoesPendentes;
        break;
      case tiposOcorrencias.FINALIZADAS:
        ocorrencias = this.props.finalizadas;
        break;
      default:
        break;
    }

    return (
      <span>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <SearchTable
              columns={this.columnsQuestionarios}
              dataSource={ocorrencias}
              size="small"
              // loading={this.state.fetching[tipo]}
              pagination={{ showSizeChanger: true }}
            />
          </Col>
        </Row>
      </span>
    );
  }

  render() {
    if (this.state.loading) {
      return <PageLoading />;
    }

    return (
      <>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              icon={<RedoOutlined />}
              style={{ marginLeft: "15px", marginBottom: "10px" }}
              onClick={() => {
                this.setState(
                  {
                    loading: false,
                    fetching: { emAndamento: true, finalizadas: true },
                  },
                  () => {
                    this.fetchOcorrencias(tiposOcorrencias.EM_ANDAMENTO);
                    this.fetchOcorrencias(tiposOcorrencias.FINALIZADAS);
                  }
                );
              }}
            />
          </Col>
        </Row>
        <Spin
          spinning={
            this.state.fetching.emAndamento || this.state.fetching.finalizadas
          }
        >
          <Tabs type="card">
            <TabPane
              size="large"
              tab="Em andamento"
              key={tiposOcorrencias.EM_ANDAMENTO}
            >
              <StyledCard
                type="flex"
                title="Interações Pendentes"
                noShadow={true}
              >
                {this.renderTableOcorrencias(tiposOcorrencias.EM_ANDAMENTO)}
              </StyledCard>
              <StyledCard type="flex" title="MTNs em Andamento" noShadow={true}>
                {this.renderTableMtns(this.props.emAndamento.mtns)}
              </StyledCard>
            </TabPane>
            <TabPane tab="Finalizadas" key={tiposOcorrencias.FINALIZADAS}>
              <TabContainer>
                {this.renderTableMtns(this.props.finalizadas)}
              </TabContainer>
            </TabPane>
          </Tabs>
        </Spin>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    emAndamento: state.mtn.meuMtn.emAndamento,
    sideBarCollapsed: state.app.sideBarCollapsed,
    finalizadas: state.mtn.meuMtn.finalizadas,
  };
};

export default connect(mapStateToProps, { toggleSideBar, fetchOcorrencias })(
  MtnMinhasOcorrencias
);
