import React, { Component } from 'react';
import { connect } from 'react-redux';
import { message, Row, Col, Button, Divider, Modal } from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import { fetchVisualizarOrdem, assinarOrdem, permiteAssinar } from 'services/ducks/OrdemServ.ducks';
import VisualizarOrdemComponent from './VisualizarOrdemComponent';
import InfoLabel from 'components/infolabel/InfoLabel';
import history from "@/history.js";
import styled from 'styled-components';

const HeaderPanel = styled.div`
  background-color: #7999b2;
  margin-top: -24px;
  margin-left: -24px;
  margin-right: -24px;
  padding-left: 24px;
  padding-right: 24px;
  padding-top: 12px;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  min-height: 40px;
  text-align: center;
  border-bottom: 3px solid #5f788b;
  margin-bottom: 15px;
`;

const TextosAssinar = {
  okText: "Assinar",
  modalText: "Confirma os dados desta O.S. e deseja efetuar a assinatura?",
  successMessage: "Ordem assinada com sucesso!",
  waitingText: "Efetuando assinatura da Ordem. Esta operação pode demorar um pouco. Favor aguardar alguns instantes.",
  mainActionButtonText: "Assinar a Ordem de Serviço",
  mainActionButtonType: "primary"
}

const TextosDarCiencia = {
  okText: "Confirmar Ciência",
  modalText: "Confirma os dados desta O.S. e deseja dar ciência na mesma?",
  successMessage: "Ciência da ordem realizada com sucesso!",
  waitingText: "Registrando a ciência na Ordem. Esta operação pode demorar um pouco. Favor aguardar alguns instantes.",
  mainActionButtonText: "Dar Ciência na Ordem de Serviço",
  mainActionButtonType: "primary"
}

const TextosRevogar = {
  okText: "Confirmar Revogação",
  modalText: "Confirma os dados desta O.S. e deseja REVOGÁ-LA?",
  successMessage: "Ordem de serviço REVOGADA com sucesso!",
  waitingText: "Realizando a REGOGAÇÃO da Ordem. Esta operação pode demorar um pouco. Favor aguardar alguns instantes.",
  mainActionButtonText: "REVOGAR Ordem de Serviço",
  mainActionButtonType: "danger"
}

class AssinarForm extends Component {

  constructor(props) {
    super(props);

    let translateTexts = {};
    
    switch (props.tipoForm) {
      case "darCiencia":
        translateTexts = {...TextosDarCiencia};
        break;

      case "revogar":
        translateTexts = {...TextosRevogar};
        break;

      default:
        translateTexts = {...TextosAssinar};
    }

    this.state = {
      loading: true,
      permiteAssinar: false,
      motivo: "",
      efetuandoAssinatura: false,
      translateTexts
    }
  }

  componentDidMount() {
    let idOrdem = this.props.idOrdem;
    
    if (idOrdem) {
      this.props.permiteAssinar(idOrdem, this.props.tipoForm)
        .then( permissao => {
          if (!permissao.podeAssinar) {
            message.error(permissao.motivo);
            this.setState({loading: false, permiteAssinar: false, motivo: permissao.motivo});
          } else {
            //tem permissao de assinar, busca os dados da ordem.
            this.setState({loading: true, permiteAssinar: true, motivo: ""}, () => {
              this.fetchOrdem(idOrdem);
            });            
          }
        })
        .catch( error => {
          message.error(error);
          this.setState({loading: false});
        })
    }
  }

  fetchOrdem = (idOrdem) => {
    this.props.fetchVisualizarOrdem(idOrdem)
    .then( () => {
      this.setState({loading: false});
    })
    .catch( (error) => {
      message.error(error);
      this.setState({loading: false, permiteAssinar: false, motivo: error});
    })
  }

  openModalConfirmacao = () => {
    Modal.confirm({
      title: "Confirmação",
      okText: this.state.translateTexts.okText,
      cancelText: "Cancelar",
      centered: true,
      onOk: this.onConfirmarAssinatura,
      okType: "danger",
      width: 550,
      content: <span>{this.state.translateTexts.modalText}</span>
    })
  }

  onConfirmarAssinatura = () => {
    let {id} = this.props.dadosOrdem.dadosBasicos;

    this.setState({efetuandoAssinatura: true}, () => {
      this.props.assinarOrdem(id, this.props.tipoForm)
      .then( () => {
        message.success(this.state.translateTexts.successMessage);
        history.push("/ordemserv/minhas-ordens");
      })
      .catch(error => {
        message.error(error);
        this.setState({efetuandoAssinatura: false})
      })
    })
  }

  render() {

    if (this.state.loading) {
      return <div><PageLoading /></div>
    }

    if (!this.state.permiteAssinar) {
      return (
        <div>
          <Row>
            <Col span={24}>
              <InfoLabel type="error" showIcon>{this.state.motivo}</InfoLabel>
            </Col>
          </Row>

          <Divider />
          
          <Row type="flex" justify="center" style={{marginBottom: 20}}>
            <Button 
              type="danger" 
              size="large"
              onClick={() => history.push('/ordemserv/minhas-ordens')}
            >Voltar para Minhas Ordens</Button>
          </Row>
        </div>
      )
    }

    if (this.state.efetuandoAssinatura) {
      return (
        <div>
          <HeaderPanel>
            <h2 style={{color: '#fff'}}>O.S. - {this.props.dadosOrdem.dadosBasicos.titulo}</h2>
          </HeaderPanel>

          <Row>
            <Col span={24}>
              <InfoLabel type="info" showIcon>{this.state.translateTexts.waitingText}</InfoLabel>
            </Col>
          </Row>

          <div style={{height: 600}}>
            <PageLoading />
          </div>
        </div>
      )
    }

    let visConfig = this.props.config || {
      mostrarDesignantes:true, 
      modoEdicaoDesignantes: true,
      mostrarDesignados:true,
      modoEdicaoDesignados: true
    };

    return (
      <div>
        <HeaderPanel>
          <h2 style={{color: '#fff'}}>O.S. - {this.props.dadosOrdem.dadosBasicos.titulo}</h2>
        </HeaderPanel>

        <Row>
          <Col span={24}>
            <VisualizarOrdemComponent dadosOrdem={this.props.dadosOrdem} 
              config={visConfig} 
            />
          </Col>
        </Row>

        <Divider />
        
        <Row type="flex" justify="center" style={{marginBottom: 20}}>
          <Button 
            type={this.state.translateTexts.mainActionButtonType} 
            size="large"
            onClick={this.openModalConfirmacao}
            >{this.state.translateTexts.mainActionButtonText}</Button>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    dadosOrdem: state.ordemserv.ordemAtual
  }
}

export default connect(mapStateToProps, {
  fetchVisualizarOrdem,
  assinarOrdem,
  permiteAssinar
})(AssinarForm);