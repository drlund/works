import React, { Component } from 'react';
import { DeleteOutlined, FileDoneOutlined } from '@ant-design/icons';
import { Modal, Row, Col, Button, message, Popconfirm } from 'antd';
import StyledCardPrimary from 'components/styledcard/StyledCardPrimary';
import { ESTADOS } from 'pages/ordemserv/Types';
import TabelaInsNormativas from './TabelaInsNormativas';
import InsNormativaForm from './InsNormativaForm';
import { connect } from 'react-redux';
import { saveInstrucoesNorm, removeInstrucaoNorm, removeAllInstrucaoNorm } from 'services/ducks/OrdemServ.ducks';
import uuid from 'uuid/v4';

class InsNormativas extends Component {

  state = {
    modalVisible: false,
    saveButtonEnabled: false,
    modalKey: uuid(),
    itensSelecionados: []
  }

  renderModal = () => {
    return (
      <Modal
        visible={this.state.modalVisible}
        centered
        closable
        maskClosable={false}
        title="Incluir Instrução Normativa"
        onCancel={this.onCloseModal}
        key={this.state.modalKey}
        width="75%"
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={this.onSaveInstrucoes}
            disabled={!this.state.saveButtonEnabled}
          >
            Salvar
          </Button>
        ]}
      >
        <InsNormativaForm
          onUpdateParent={this.onUpdateParent}
          initialState={{itensSelecionados: this.props.listaInstrucoes}}
          estadoOrdem={this.props.estadoOrdem}
        />
      </Modal>
    )
  }

  onOpenModal = () => {
    this.setState({modalVisible: true, modalKey: uuid(), saveButtonEnabled: false})
  }

  onCloseModal = () => {
    this.setState({modalVisible: false, modalKey: uuid(), saveButtonEnabled: false})
  }

  onUpdateParent = (itensSelecionados) => {
    let valid = itensSelecionados.length > 0;
    this.setState({ saveButtonEnabled: valid, itensSelecionados});
  }

  onSaveInstrucoes = () => {
    this.props.saveInstrucoesNorm(this.state.itensSelecionados, {
      successCallback: () => {
        this.onCloseModal();
        message.success('Instruções salvas com sucesso!');
      },
      errorCallback: (what) => { message.error(what) }
    })
  }

  onRemoverItem = (key) => {
    this.props.removeInstrucaoNorm(key, {
      successCallback: () => { message.success("Instrução removida com sucesso!")},
      errorCallback: (what) => { message.error(what) }
    })
  }

  onClearInstrucoes = () => {
    this.props.removeAllInstrucaoNorm();
  }

  render() {
    return (
      <StyledCardPrimary noShadow={false} title={
        <Row>
          <Col span={12}>
            <strong>Instruções Normativas</strong>
          </Col>
          { this.props.estadoOrdem === ESTADOS.RASCUNHO &&          
            <Col span={12} style={{ textAlign: 'right'}}>
              <Button type="default" icon={<FileDoneOutlined />} onClick={this.onOpenModal} style={{marginRight: 10}}>
                Incluir Instrução
              </Button>
              {
                this.props.listaInstrucoes.length > 0 &&
                <Popconfirm title="Deseja excluir todas as instruções?" placement="topLeft" onConfirm={this.onClearInstrucoes} >
                  <Button type="default" icon={<DeleteOutlined />}/>
                </Popconfirm>
              }
            </Col>          
          }
        </Row>            
      }>
        <Row>
          <Col span={24}>
            <TabelaInsNormativas 
              dadosTabela={this.props.listaInstrucoes} 
              onRemoverRegistro={this.onRemoverItem}
              estadoOrdem={this.props.estadoOrdem}
            />
          </Col>
        </Row>
        {this.renderModal()}
      </StyledCardPrimary>
    );
  }
}

const mapStateToProps = state => {
  return {
    listaInstrucoes: state.ordemserv.ordemEdicao.instrucoesNorm || [],
    estadoOrdem: state.ordemserv.ordemEdicao.dadosBasicos ? state.ordemserv.ordemEdicao.dadosBasicos.estado : 1
  }
}

export default connect(mapStateToProps, {
  saveInstrucoesNorm,
  removeInstrucaoNorm,
  removeAllInstrucaoNorm
})(InsNormativas);
