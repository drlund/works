import React, { Component } from "react";
import { EyeOutlined } from "@ant-design/icons";
import { Tooltip, Modal, Button } from "antd";
import AlfaSort from "utils/AlfaSort";
import IntegerSort from "utils/IntegerSort";
import SearchTable from "components/searchtable/SearchTable";
import ReactHtmlParser from "react-html-parser";
import VisualizarAlteracoesInsNorm from "./VisualizarAlteracoesInsNorm";
import uuid from "uuid/v4";

class TabelaInsNormativasAlteradas extends Component {
  state = {
    modalVisible: false,
    modalKey: uuid(),
    instrucaoSelecionada: null
  };

  renderTable = () => {
    let columns = [
      {
        title: "IN",
        dataIndex: "nroINC",
        sorter: (a, b) => IntegerSort(a.nroINC, b.nroINC)
      },
      {
        title: "Título",
        dataIndex: "titulo",
        sorter: (a, b) => AlfaSort(a.titulo, b.titulo),
        render: text => {
          return ReactHtmlParser(text);
        }
      },
      {
        title: "Tipo Norm.",
        dataIndex: "tipoNormativo",
        sorter: (a, b) => AlfaSort(a.tipoNormativo, b.tipoNormativo)
      },
      {
        title: "Item",
        dataIndex: "item",
        sorter: (a, b) => AlfaSort(a.item, b.item)
      },
      {
        title: "Versão Atual",
        dataIndex: "versao",
        sorter: (a, b) => IntegerSort(a.versao, b.versao)
      },
      {
        title: "Nova Versão",
        dataIndex: "novaVersao",
        sorter: (a, b) => IntegerSort(a.novaVersao, b.novaVersao)
      },
      {
        title: "Ações",
        width: "10%",
        align: "center",
        render: (text, record) => {
          return (
            <span>
              <Tooltip title="Visualizar Alterações nos Textos">
                <EyeOutlined
                  className="link-color link-cursor"
                  onClick={() => this.onVisualizar(record)}
                  style={{ fontSize: "16px" }}
                />
              </Tooltip>
            </span>
          );
        }
      }
    ];

    return (
      <SearchTable
        columns={columns}
        dataSource={this.props.dadosTabela}
        size="small"
        pagination={{ showSizeChanger: true, defaultPageSize: 5 }}
      />
    );
  };

  onVisualizar = record => {
    this.setState({
      instrucaoSelecionada: { ...record },
      modalVisible: true,
      modalKey: uuid()
    });
  };

  renderModal = () => {
    let title = "";

    if (this.state.instrucaoSelecionada) {
      let { nroINC, titulo } = this.state.instrucaoSelecionada;
      title = (
        <span>
          [IN-{nroINC}] - {ReactHtmlParser(titulo)}
        </span>
      );
    }

    return (
      <Modal
        title={title}
        key={this.state.modalKey}
        visible={this.state.modalVisible}
        width="50%"
        centered
        bodyStyle={{ paddingTop: 10, paddingBottom: 10, minHeight: 400 }}
        destroyOnClose
        maskClosable={false}
        footer={
          <Button type="danger" onClick={this.closeModal}>
            Fechar
          </Button>
        }
        onCancel={this.closeModal}
      >
        <VisualizarAlteracoesInsNorm
          dadosInstrucao={this.state.instrucaoSelecionada}
        />
      </Modal>
    );
  };

  closeModal = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    return (
      <div>
        {this.renderTable()}
        {this.renderModal()}
      </div>
    );
  }
}

export default TabelaInsNormativasAlteradas;
