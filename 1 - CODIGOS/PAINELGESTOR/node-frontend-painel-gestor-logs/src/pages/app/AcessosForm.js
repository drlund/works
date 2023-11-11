import React, { Component } from 'react';
import {
  ClockCircleOutlined,
  DeleteOutlined, EditOutlined, EyeOutlined, PlusOutlined, RedoOutlined
} from '@ant-design/icons';
import {
  Button,
  Row,
  Col,
  Popconfirm,
  Divider,
  message,
  Modal,
  Tooltip,
  Timeline,
  Checkbox
} from 'antd';
import uuid from 'uuid/v4';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  fetchListaConcessoes,
  fetchListaFerramentas,
  saveConcessaoAcesso,
  deleteConcessaoAcesso
} from 'services/actions/commons/acessos';
import SearchTable from 'components/searchtable/SearchTable';
import AlfaSort from 'utils/AlfaSort';
import { displayDateBR } from 'utils/dateFunctions/displayDateBR';
import { getTiposAcesso } from 'pages/app/apiCalls';
import DetalheAcessosForm from './DetalheAcessosForm';

class AcessosForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      saveButtonDisabled: true,
      saving: false,
      fetching: false,
      title: 'Novo Acesso',
      dadosTabela: [],
      formData: {},
      formKey: uuid(),
      listaFerramentas: [],
      tiposAcesso: [],
    };
  }

  componentDidMount() {
    this.fetchAllList();
    this.onFetchFerramentas();
    this.fetchTiposAcesso();
  }

  fetchTiposAcesso = () => {
    getTiposAcesso()
      .then((tiposAcesso) => this.setState({ tiposAcesso }, () => true))
      .catch(() => message.error('Problema ao recuperar os tipos de identificadores!'));
  };

  fetchAllList = (check = null) => {
    const ativo = (!check?.target.checked ?? true) ? 1 : 0;

    const { fetchListaConcessoes: thisFetchListaConcessoes } = this.props;
    this.setState({ fetching: true }, () => {
      thisFetchListaConcessoes(
        ativo,
        {
          successCallback: this.onFetchList,
          errorCallback: this.onFetchError
        }
      );
    });
  };

  onFetchList = (fetchedList) => {
    const prepList = fetchedList.map((elem) => {
      const newElem = { ...elem };
      newElem.nomeFerramenta = elem.ferramenta.nomeFerramenta;
      return newElem;
    });

    this.setState({ dadosTabela: prepList, fetching: false });
  };

  onFetchError = (what) => {
    if (what) {
      message.error(what);
    } else {
      message.error('Falha ao receber a lista de concessoes!');
    }

    this.setState({ fetching: false });
  };

  /**
   * Obtem a lista de ferramentas cadastradas no controle de acesso.
   */
  onFetchFerramentas = () => {
    const { fetchListaFerramentas: thisFetchListaFerramentas } = this.props;
    thisFetchListaFerramentas({
      successCallback: this.onFetchFerramentasSuccess,
      errorCallback: this.onFetchError
    });
  };

  /**
   * Sucesso no retorno da busca da lista de ferramentas.
   */
  onFetchFerramentasSuccess = (fetchedList) => {
    this.setState({ listaFerramentas: [...fetchedList] });
  };

  renderTable = () => {
    const { dadosTabela: stateDadosTabela, fetching } = this.state;
    const columns = [
      {
        title: 'Identificador',
        dataIndex: 'identificador',
        width: '15%',
        sorter: (a, b) => AlfaSort(a.identificador, b.identificador)
      },
      {
        title: 'Tipo do Identificador',
        dataIndex: 'tipoNome',
        width: '15%',
        sorter: (a, b) => AlfaSort(a.tipoNome, b.tipoNome)
      },
      {
        title: 'Nome do Identificador',
        dataIndex: 'nomeIdentificador',
        width: '35%',
        sorter: (a, b) => AlfaSort(a.nomeIdentificador, b.nomeIdentificador)
      },
      {
        title: 'Ferramenta',
        dataIndex: 'nomeFerramenta',
        width: '15%',
        sorter: (a, b) => AlfaSort(a.nomeFerramenta, b.nomeFerramenta)
      },
      {
        title: 'Validade',
        dataIndex: 'validade',
        width: '10%',
        sorter: (a, b) => parseInt(moment(a.validade || '9999-12-31').format('YYYYMMDD'), 10) - parseInt(moment(b.validade || '9999-12-31').format('YYYYMMDD'), 10),
        render: (validade) => (moment(validade).isValid() ? displayDateBR(moment(validade)) : '')
      },
      {
        title: 'Ações',
        width: '10%',
        align: 'center',
        render: (_, record) => (
          <span>
            <Tooltip title="Ver Log">
              <EyeOutlined
                className="link-color"
                onClick={() => {
                  Modal.info({
                    title: 'Log de acessos',
                    content: (
                      <Timeline>
                        {
                          record.log.map((item) => (
                            <Timeline.Item
                              dot={<ClockCircleOutlined className="timeline-clock-icon" />}
                            >
                              {item}
                            </Timeline.Item>
                          ))
                        }

                      </Timeline>
                    )
                  });
                }} />
            </Tooltip>

            <Divider type="vertical" />

            <Tooltip title="Editar">
              <EditOutlined
                className="link-color link-cursor"
                onClick={() => this.onEditarRegistro(record)} />
            </Tooltip>

            {
              record.ativo
                ? (
                  <>
                    <Divider type="vertical" />
                    <Popconfirm title="Deseja excluir este acesso?" placement="left" onConfirm={() => this.onRemoverRegistro(record.id || record._id)}>
                      <DeleteOutlined className="link-color" />
                    </Popconfirm>
                  </>
                )
                : null
            }
          </span>
        ),
      }
    ];

    const dadosTabela = stateDadosTabela.map((elem) => ({ ...elem, key: elem.id }));

    return (
      <SearchTable
        columns={columns}
        dataSource={dadosTabela}
        size="small"
        loading={fetching}
        pagination={{ showSizeChanger: true }}

      />
    );
  };

  renderModal = () => {
    const {
      modalVisible,
      title,
      saving,
      saveButtonDisabled,
      formData,
      formKey,
      listaFerramentas,
      tiposAcesso
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
      >
        <DetalheAcessosForm
          key={formKey}
          onFormChange={this.onFormChange}
          formData={formData}
          listaFerramentas={listaFerramentas}
          tiposAcesso={tiposAcesso}
        />
      </Modal>
    );
  };

  onConfirmSave = () => {
    const { formData } = this.state;
    const { saveConcessaoAcesso: thisSaveConcessaoAcesso } = this.props;

    // validando o nome da ferramenta
    const nomeValido = formData.identificador.trim().length;
    const ferramentaValida = formData.idFerramenta.trim().length;
    const listaValida = formData.permissoes.length;
    const tipoId = formData.tipo.trim().length;

    if (!tipoId) {
      message.error('Informe o tipo do identificador!');
      return;
    }

    if (!nomeValido) {
      message.error('Informe o identificador da ferramenta!');
      return;
    }

    if (!ferramentaValida) {
      message.error('Informe a ferramenta!');
      return;
    }

    if (!listaValida) {
      message.error('Informe ao menos uma permissão!');
      return;
    }

    this.setState({ saving: true }, () => {
      thisSaveConcessaoAcesso({
        dadosConcessao: formData,
        responseHandler: {
          successCallback: this.onSaveSuccess,
          errorCallback: this.onSaveError
        }
      });
    });
  };

  onSaveSuccess = () => {
    this.setState({
      modalVisible: false,
      saving: false,
      formData: {},
      formKey: uuid(),
      saveButtonDisabled: true,
    }, () => {
      message.success('Concessão de acesso salva com sucesso!');
      this.fetchAllList();
    });
  };

  onSaveError = (what) => {
    this.setState({ saving: false }, () => {
      if (what) {
        message.error(what);
        return;
      }

      message.error('Falha ao salvar os dados da ferramenta!');
    });
  };

  onEditarRegistro = (registro) => {
    const formData = {
      id: registro.id || registro._id,
      identificador: registro.identificador,
      permissoes: [...registro.permissoes],
      idFerramenta: registro.ferramenta.id,
      tipo: registro.tipo.id,
      validade: registro.validade,
      editMode: true
    };

    this.setState({
      formData,
      formKey: uuid(),
      title: 'Editar Acesso',
      modalVisible: true
    });
  };

  onRemoverRegistro = (idConcessao) => {
    const { deleteConcessaoAcesso: thisDeleteConcessaoAcesso } = this.props;
    this.setState({ fetching: true }, () => {
      thisDeleteConcessaoAcesso({
        idConcessao,
        responseHandler: {
          successCallback: this.onRemoveSuccess,
          errorCallback: this.onRemoveError
        }
      });
    });
  };

  onRemoveSuccess = () => {
    message.success('Acesso removido com sucesso!');
    this.fetchAllList();
  };

  onRemoveError = (what) => {
    this.setState({ fetching: false }, () => {
      if (what) {
        message.error(what);
        return;
      }
      message.error('Falha ao remover este acesso!');
    });
  };

  onModalClose = () => {
    this.setState({ modalVisible: false, saveButtonDisabled: true });
  };

  renderActionButtons = () => {
    const {
      listaFerramentas,
      fetching,
    } = this.state;
    return (
      <Row style={{ marginBottom: '15px' }}>
        <Col span={24} style={{ textAlign: 'right' }}>
          <Checkbox
            onChange={this.fetchAllList}
          >
            Inativos
          </Checkbox>
          <Button
            style={{ marginLeft: '15px' }}
            icon={<PlusOutlined />}
            type="primary"
            disabled={listaFerramentas.length === 0}
            onClick={() => this.onNewRegister()}
          >
            Novo Acesso
          </Button>
          <Button
            icon={<RedoOutlined />}
            loading={fetching}
            style={{ marginLeft: '15px' }}
            onClick={() => this.fetchAllList()}
          />
        </Col>
      </Row>
    );
  };

  onNewRegister = () => {
    this.setState({
      modalVisible: true,
      saveButtonDisabled: true,
      title: 'Novo Acesso',
      formData: {},
      formKey: uuid()
    });
  };

  onFormChange = (formData) => {
    const { dadosTabela } = this.state;
    const [linha] = dadosTabela.filter((elem) => elem._id === formData.id);
    const saveButtonDisabled = (!formData.tipo || !formData.tipo.trim().length)
      || (!formData.identificador || !formData.identificador.trim().length)
      || (!formData.idFerramenta || !formData.idFerramenta.trim().length)
      || (
        !formData.permissoes
        || !formData.permissoes.length
        || linha?.permissoes === formData.permissoes.length
      )
      || (linha && moment(formData?.validade).startOf('day').isSame(moment(linha?.validade).startOf('day')));
    this.setState({ formData, saving: false, saveButtonDisabled });
  };

  render() {
    return (
      <div>
        {this.renderActionButtons()}
        <Row>
          <Col span={24}>
            {this.renderTable()}
          </Col>
        </Row>
        {this.renderModal()}
      </div>
    );
  }
}

export default connect(null, {
  fetchListaConcessoes,
  fetchListaFerramentas,
  saveConcessaoAcesso,
  deleteConcessaoAcesso
})(AcessosForm);
