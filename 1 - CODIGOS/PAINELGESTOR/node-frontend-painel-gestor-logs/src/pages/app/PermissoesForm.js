import React, { Component } from 'react'
import { DeleteOutlined, EditOutlined, PlusOutlined, RedoOutlined } from '@ant-design/icons';
import { Button, Row, Col, Popconfirm, Divider, message, Modal, Tooltip } from 'antd';

import FerramentaForm from './FerramentaForm';
import SearchTable from 'components/searchtable/SearchTable';
import AlfaSort from 'utils/AlfaSort';
import uuid from 'uuid/v4';
import { 
  fetchListaFerramentas, 
  savePermissoesFerramenta, 
  deletePermissoesFerramenta 
} from 'services/actions/commons/acessos';
import { connect } from 'react-redux';

class PermissoesForm extends Component {

  state = {
    modalVisible: false,
    saveButtonDisabled: true,
    saving: false,
    fetching: false,
    title: 'Nova Ferramenta',
    dadosTabela: [],
    formData: {},
    formKey: uuid()
  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState({ fetching: true }, () => {
      this.props.fetchListaFerramentas({
        successCallback: this.onFetchList,
        errorCallback: this.onFetchError
      })  
    })
  }

  onFetchList = (fetchedList) => {
    this.setState({dadosTabela: fetchedList, fetching: false});
  }

  onFetchError = (what) => {
    if (what) {
      message.error(what);
    } else {
      message.error('Falha ao receber a lista de ferramentas!');
    }

    this.setState({fetching: false});    
  }

  renderTable = () => {
    let columns = [
      {
        title: 'Ferramenta',
        dataIndex: "nomeFerramenta",
        sorter: (a, b) => AlfaSort(a.nomeFerramenta, b.nomeFerramenta)
      },
      {
        title: 'Ações',
        width: '10%',
        align: 'center',
        render: (text,record) => {
          return (
            <span>     
              <Tooltip title="Editar">
                  <EditOutlined
                    className="link-color link-cursor"
                    onClick={() => this.onEditarRegistro(record)} />
              </Tooltip>
        
              <Divider type="vertical" />

              <Popconfirm 
                title={<React.Fragment>Deseja excluir esta ferramenta?<br/><b>Atenção</b>: Irá excluir também os usuários<br/>com acesso vinculado.</React.Fragment>} 
                placement="left" 
                onConfirm={() => this.onRemoverRegistro(record.id) } 
              >
                <DeleteOutlined className="link-color" />
              </Popconfirm>               
            </span>
          );
        }
      }
    ];

    const dadosTabela = this.state.dadosTabela.map(elem => {
      return { ...elem, key: elem.id }
    })

    return (
      <SearchTable               
        columns={columns} 
        dataSource={dadosTabela}
        size="small"
        loading={this.state.fetching}
        pagination={{showSizeChanger: true}}
        
      />
    )
  }

  renderModal = () => {
    return (
      <Modal
        visible={this.state.modalVisible}
        title={this.state.title}
        centered
        onOk={this.onConfirmSave}
        onCancel={this.onModalClose}
        maskClosable={false}
        footer={[
          <Button 
            key="back" 
            onClick={this.onModalClose}
            disabled={this.state.saving}
          >
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={this.state.saving} 
            onClick={this.onConfirmSave}
            disabled={this.state.saveButtonDisabled}
          >
            Salvar
          </Button>
        ]}
      >
        <FerramentaForm 
          key={this.state.formKey} 
          onFormChange={this.onFormChange} 
          formData={this.state.formData} 
        />
      </Modal>
    )
  }

  onFormChange = (formData) => {
    this.setState({ formData, saving: false, saveButtonDisabled: false });
  }

  onConfirmSave = () => {
    //validando o nome da ferramenta
    let nomeValido = this.state.formData.nomeFerramenta.trim().length;
    let listaValida = this.state.formData.listaPermissoes.length;

    if (!nomeValido) {
      message.error("Informe o nome da ferramenta!");
      return;
    }

    if (!listaValida) {
      message.error('Informe ao menos uma permissão!');
      return;
    }

    this.setState({ saving: true }, () => {
      this.props.savePermissoesFerramenta({
        dadosPermissoes: this.state.formData,
        responseHandler: {
          successCallback: this.onSaveSuccess,
          errorCallback: this.onSaveError
        }
      });  
    });
  }

  onSaveSuccess = () => {
    this.setState({ modalVisible: false, saving: false, formData: {}, formKey: uuid() }, () => {
      message.success("Ferramenta salva com sucesso!");
      this.fetchAllList();
    });
  }

  onSaveError = (what) => {
    this.setState({ saving: false }, () => {
      if (what) {
        message.error(what);
        return;
      }
  
      message.error('Falha ao salvar os dados da ferramenta!')  
    });
  }

  onAddFerramenta = () => {
    this.setState({ 
      modalVisible: true, 
      saveButtonDisabled: true,
      title: "Nova Ferramenta",
      formData: {},
      formKey: uuid()
    });
  }

  onEditarRegistro = (registro) => {
    this.setState({ 
      formData: registro, 
      formKey: uuid(), 
      title: "Editar Ferramenta",
      modalVisible: true, 
      saveButtonDisabled: true
    });
  }

  onRemoverRegistro = (idFerramenta) => {
    this.setState({ fetching: true }, () => {
      this.props.deletePermissoesFerramenta({
        idFerramenta,
        responseHandler: {
          successCallback: this.onRemoveSuccess,
          errorCallback: this.onRemoveError
        }
      })  
    });
  }

  onRemoveSuccess = (response) => {
    let newList = this.state.dadosTabela.filter(elem => elem.id !== response.id);
    this.setState({ dadosTabela: newList, fetching: false });
    message.success("Ferramenta removida com sucesso!");
  }

  onRemoveError = (what) => {
    this.setState({ fetching: false}, () => {
      if (what) {
        message.error(what);
        return;
      }
  
      message.error('Falha ao remover os dados da ferramenta!')  
    });
  }

  onModalClose = () => {
    this.setState({ modalVisible: false });
  }

  renderActionButtons = () => {
    return (
      <Row style={{marginBottom: '15px'}}>          
        <Col span={24} style={{textAlign: 'right'}}>
          <Button 
            icon={<PlusOutlined />} 
            type="primary" 
            onClick={() => this.onAddFerramenta()}
          >
          Nova Ferramenta
          </Button>
          <Button 
            icon={<RedoOutlined />} 
            loading={this.state.fetching}
            style={{marginLeft: '15px'}}
            onClick={() => this.fetchAllList()}
          />
        </Col>
      </Row>
    );
  }

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
    )
  }
}

export default connect(null, {
  fetchListaFerramentas,
  savePermissoesFerramenta,
  deletePermissoesFerramenta
})(PermissoesForm);
