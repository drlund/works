import React, { Component } from "react";
import SearchTable from "components/searchtable/SearchTable";
//Components
import ListaQuestionarios from "components/mtn/ListaQuestionarios";
import AlfaSort from "utils/AlfaSort";
import { RedoOutlined, OrderedListOutlined } from '@ant-design/icons';
import { message, Tooltip, Modal, Button,  Row, Col } from "antd";

class InteracoesPendentes extends Component {

  state = {
    selectedRowKeys: [],
    modal: {
      visible: false,
      title: ""
    }
  };

  columns = [
    {
      dataIndex: "matricula",
      title: "Matrícula",      
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
    },
    {
      dataIndex: "nome",
      title: "Nome",      
      sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
    }
  ];

  getTableActions = record => {
    let props =
      record.visualizado === "Sim"
        ? {
            className: "link-color link-cursor",
            onClick: () => this.showModal(record)
          }
        : {};
    return (
      <Tooltip placement="left" disabled title="Logs">
        <OrderedListOutlined {...props} />
      </Tooltip>
    );
  };


  /** Modal Methods */

  showModal = dadosForm => {
    this.setState({ selectedRowKeys: [] }, () => {
      this.props.fetchLogsAcesso({
        dadosForm,
        responseHandler: {
          successCallback: () => {
            this.setState({ modal: { title: `Log de Acesso`, visible: true } });
          },
          errorCallback: () =>
            message.error(
              "Erro ao recuperar lista de questionários. Tente novamente mais tarde."
            )
        }
      });
    });
  };

  hideModal = () => {
    this.setState({ modal: { visible: false } });
  };

  renderModalLogs = () => {
    let arrButtons = [];
    arrButtons.push(
      <Button key="back" onClick={this.hideModal}>
        Fechar
      </Button>
    );

    let columnsLog = [
      {
        dataIndex: "idResposta",
        title: "ID Resposta",
        sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
      },
      {
        dataIndex: "acessadoEm",
        title: "Acessado Em",
        sorter: (a, b) => AlfaSort(a.titulo, b.titulo)
      }
    ];

    return (
      <Modal
        title={this.state.modal.title}
        visible={this.state.modal.visible}
        footer={arrButtons}
        width={850}
        onOk={this.hideModal}
        onCancel={this.hideModal}
        maskClosable={true}
        keyboard={true}
      >
        <SearchTable
          columns={columnsLog}
          dataSource={this.props.logs}
          size="small"
          pagination={{ showSizeChanger: true }}
        />
      </Modal>
    );
  };

  /** Response Handlers */

  render() {
    return (
      <span>
        <Row style={{ marginBottom: "15px" }}>
          <Col span={24} style={{ textAlign: "right" }}>
            <Button
              icon={<RedoOutlined />}
              loading={this.state.fetching}
              style={{ marginLeft: "15px" }}
              onClick={() => this.props.fetchQuestionarios()}
            />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: "right" }}>
            <ListaQuestionarios
              loading={this.props.fetching}
              questionarios={this.props.questionarios}
              columns={this.columns}
              getTableActions={this.getTableActions}
            />
            {this.renderModalLogs()}
          </Col>
        </Row>
      </span>
    );
  }
}

export default InteracoesPendentes;
