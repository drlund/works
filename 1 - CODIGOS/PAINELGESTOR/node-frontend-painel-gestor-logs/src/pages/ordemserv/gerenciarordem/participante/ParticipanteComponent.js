import React, { Component } from 'react';
import { DeleteOutlined, UserAddOutlined } from '@ant-design/icons';
import { Modal, Row, Col, Button, message, Popconfirm } from 'antd';
import StyledCardPrimary from 'components/styledcard/StyledCardPrimary';
import TabelaParticipantes from './TabelaParticipantes';
import { ESTADOS, TIPO_PARTICIPANTE } from 'pages/ordemserv/Types';
import ParticipanteForm from './ParticipanteForm';
import { connect } from 'react-redux';
import { saveParticipante, removeParticipante,
         removeAllDesignantes, removeAllDesignados } from 'services/ducks/OrdemServ.ducks';
import _ from 'lodash';
import uuid from 'uuid/v4';

const participanteDefaults = {
  prefixo: "",
  nomeDependencia: "",
  nomeTipoVinculo: "",
  matricula: "",
  nomeFunci: "",
  cargoComissao: "",
  codigoComite: 0,
  nomeComite: "",
  quorumMinimo: 0
}

class ParticipanteComponent extends Component {

  state = {
    modalVisible: false,
    saveButtonEnabled: false,
    modalKey: uuid(),
    participanteAtual: {
      ...participanteDefaults,
      tipoParticipante: this.props.tipoParticipante
    }
  }

  renderModal = () => {
    let participante = _.capitalize(this.props.tipoParticipante);
    let title = this.state.participanteAtual.id ? "Editar" : "Incluir";

    return (
      <Modal
        visible={this.state.modalVisible}
        centered
        closable
        maskClosable={false}
        title={`${title} ${participante}`}
        onCancel={this.onCloseModal}
        key={this.state.modalKey}
        width={900}
        footer={[
          <Button key="back" onClick={this.onCloseModal}>
            Cancelar
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            onClick={this.onSaveParticipante}
            disabled={!this.state.saveButtonEnabled}
          >
            Salvar
          </Button>
        ]}
      >
        <ParticipanteForm 
          participante={this.state.participanteAtual}
          onUpdateParent={this.onUpdateParent}
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

  //metodo utilizado pelos filhos para repassar as atualzações dos seus dados para o 
  //participante atual sendo criado/editado
  onUpdateParent = (dadosParticipante, valid) => {
    this.setState({ saveButtonEnabled : valid, participanteAtual: { ...this.state.participanteAtual, ...dadosParticipante } });
  }

  //confirmacao do salvamente dos dados do participante no store
  onSaveParticipante = () => {
    //salva os dados no store da ordemAtual
    this.props.saveParticipante(this.state.participanteAtual, 
      {
        successCallback: this.onParticipanteSaved,
        errorCallback: this.onErrorSaving
      }
    );
  }

  //evento solicitando abertura do modal para inclusao de um novo participante
  onNovoParticipante = () => {
    this.setState({ participanteAtual: { ...participanteDefaults, tipoParticipante: this.props.tipoParticipante }}, () => {
      this.onOpenModal();
    })
  }

  //dados do participante foram salvos com sucesso no store
  onParticipanteSaved = () => {
    this.setState({modalVisible: false});
  }

  onErrorSaving = (what) => {
    message.error(what);
  }

  //metodo de remocao de um participante da lista no store
  onRemoverParticipante = (id, tipoParticipante) => {    
    this.props.removeParticipante(id,
      {
        successCallback: () => { 
          let participante = _.capitalize(this.props.tipoParticipante);
          message.success(`${participante} removido com sucesso!`)
        },
        errorCallback: this.onErrorSaving
      }
    );
  }

  //evento solicitado a edicao de um participante
  onEditarParticipante = (record) => {
    this.setState({ participanteAtual: { ...record }}, () => {
      this.onOpenModal();
    })
  }

  onClearAll = () => {
    if (this.props.tipoParticipante === TIPO_PARTICIPANTE.DESIGNANTE) {
      this.props.removeAllDesignantes();
      message.success("Todos os designantes foram removidos!")
    } else {
      this.props.removeAllDesignados();
      message.success("Todos os designados foram removidos!")
    }
    
  }

  podeEditarDesignado = () => {
    if (this.props.estado === ESTADOS.RASCUNHO) {
      return true;
    }

    let podeEditar = false;
    
    //verifica se esta exibindo a lista de designados
    if (this.props.tipoParticipante === TIPO_PARTICIPANTE.DESIGNADO) {
      //regra de permissao - só pode incluir / editar designados se
      //a ordem estiver vigente e o usuario logado for designante
      if ( this.props.estado === ESTADOS.VIGENTE  && this.props.isDesignante ) {
        podeEditar = true;
      }
    }

    return podeEditar;
  }

  render() {
    let participante = _.capitalize(this.props.tipoParticipante);
    let dadosParticipantes = this.props.listaParticipantes.filter( elem => elem.tipoParticipante === this.props.tipoParticipante);
    let podeEditarDesignado = this.podeEditarDesignado();

    return (
      <StyledCardPrimary noShadow={false} title={
        <Row>
          <Col span={12}>
            <strong>{`${participante}s`}</strong>
          </Col>
          <Col span={12} style={{ textAlign: 'right'}}>
            {
              (podeEditarDesignado)
              &&
              <Button type="default" icon={<UserAddOutlined />} onClick={this.onNovoParticipante}>
                {`Incluir ${participante}`}
              </Button>
            }

            {
              (dadosParticipantes.length > 0) && (this.props.estado === ESTADOS.RASCUNHO) &&
              <Popconfirm title={`Deseja excluir todos os ${participante}s?`} placement="topLeft" onConfirm={this.onClearAll} >
                <Button type="default" icon={<DeleteOutlined />} style={{marginLeft: 10}}/>
              </Popconfirm>
            }

          </Col>
        </Row>            
      }>

        <Row>
          <Col span={24}>
            <TabelaParticipantes 
              tipoParticipante={this.props.tipoParticipante}  
              dadosParticipantes={dadosParticipantes}
              estado={this.props.estado}
              onEditarRegistro={this.onEditarParticipante}
              onRemoverRegistro={this.onRemoverParticipante}
              podeEditarDesignado={podeEditarDesignado}
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
    listaParticipantes: state.ordemserv.ordemEdicao.participantes ? state.ordemserv.ordemEdicao.participantes : [],
    estado: state.ordemserv.ordemEdicao.dadosBasicos.estado ? state.ordemserv.ordemEdicao.dadosBasicos.estado : null,
    isDesignante: state.ordemserv.ordemEdicao.isDesignante,
  }
}

export default connect(mapStateToProps, {
  saveParticipante,
  removeParticipante,
  removeAllDesignantes,
  removeAllDesignados
})(ParticipanteComponent);