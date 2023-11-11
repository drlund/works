import React, { Component } from 'react';
import uuid from 'uuid/v4';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import {
  Button,
  Divider,
  Tooltip,
  Modal,
} from 'antd';

import SearchTable from 'components/searchtable/SearchTable';
import AlfaSort from 'utils/AlfaSort';

class Acessos extends Component {
  constructor() {
    super();
    this.state = {
      fetching: false,
      dadosTabela: []
    };
  }

  renderTabelaFuncis = () => {
    const { fetching, dadosTabela } = this.state;

    const columns = [
      {
        key: uuid(),
        dataIndex: 'matricula',
        title: 'Matrícula',
        width: '5%',
        sorter: (a, b) => AlfaSort(a.matricula, b.matricula),
        render: (matricula) => matricula,
      },
      {
        key: uuid(),
        dataIndex: 'nome',
        title: 'Nome',
        width: '15%',
        sorter: (a, b) => AlfaSort(a.nome, b.nome),
        render: (nome) => nome,
      },
      {
        key: uuid(),
        dataIndex: 'funcao',
        title: 'Função',
        width: '5%',
        sorter: (a, b) => AlfaSort(a.nome, b.nome),
        render: (funcao) => funcao,
      },
      {
        key: uuid(),
        dataIndex: 'acoes',
        title: 'Ações',
        width: '2%',
        align: 'center',
        render: (_, record) => (
          <div>
            <span>
              <Tooltip title="Visualizar">
                <EyeOutlined
                  className="link-color link-cursor"
                  onClick={() => this.onVerRegistro(record)} />
              </Tooltip>

              <Divider type="vertical" />

              <Tooltip title="Editar">
                <EditOutlined
                  className="link-color link-cursor"
                  onClick={() => this.onEditarRegistro(record)} />
              </Tooltip>
            </span>
          </div>
        ),
      }
    ];

    return (
      <SearchTable
        columns={columns}
        dataSource={dadosTabela}
        size="small"
        loading={fetching}
      />
    );
  };

  onEditarRegistro = (registro) => {
    const formData = {
      id: registro.id,
      identificador: registro.identificador,
      permissoes: [...registro.permissoes],
    };

    this.setState({
      formData,
      formKey: uuid(),
      title: 'Editar Acesso',
      modalVisible: true,
      saveButtonDisabled: false
    });
  };

  onVerRegistro = (registro) => {

  };

  renderModal = () => {
    const {
      modalVisible, saveButtonDisabled, saving, title
    } = this.state;
    return (
      <Modal
        visible={modalVisible}
        title={title}
        centered
        onOk={this.onConfirmSave}
        onCancel={this.onModalClose}
        maskClosable={false}
        footer={[
          <Button
            key="back"
            onClick={this.onModalClose}
            disabled={saving}
          >
            Cancelar
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={saving}
            onClick={this.onConfirmSave}
            disabled={saveButtonDisabled}
          >
            Salvar
          </Button>
        ]}
      />
    );
  };

  render() {
    return (
      <div>
        <div>
          {this.renderTabelaFuncis()}
        </div>
        {this.renderModal()}
      </div>
    );
  }
}

export default Acessos;
