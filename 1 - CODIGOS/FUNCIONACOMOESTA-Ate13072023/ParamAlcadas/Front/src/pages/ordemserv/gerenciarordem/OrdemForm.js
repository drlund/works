import React, { Component } from 'react'
import AbaDadosBasicos from './AbaDadosBasicos';
import Colaboradores from './Colaboradores';
import AutorizacaoConsulta from './AutorizacaoConsulta';
import LinkPublico from './LinkPublico';
import { Tabs, Button, Modal, Alert, message } from 'antd';
import PageLoading from 'components/pageloading/PageLoading';
import { connect } from 'react-redux';
import { saveOrdem, finalizarRascunho } from 'services/ducks/OrdemServ.ducks';
import AlertList from 'components/alertlist/AlertList';
import { ESTADOS } from '../Types';
import styled from 'styled-components';
import history from "@/history.js";

const { TabPane } = Tabs;

const TabLabel = styled.label`
  color: !important;
  cursor: pointer;
`;

class OrdemForm extends Component {

  state = {
    saving: false,
    finalizandoRascunho: false,
    errorsList: []
  }

  onCancelarClick = () => {
    Modal.confirm({
      title: "Confirmar Cancelamento",
      content: "Deseja descartar as alterações realizadas nesta ordem?",
      okText: "Sim",
      cancelText: "Não",
      centered: true,
      onOk: () => history.push("/ordemserv/minhas-ordens")
    })
  }

  renderActions = () => {
    let permiteFinalizarRascunho = this.props.estado === ESTADOS.RASCUNHO && this.props.idOrdem;

    return (
      <div>
        { permiteFinalizarRascunho &&
          <Button 
            type="danger" 
            style={{marginRight: 30}}
            onClick={this.onFinalizarRascunho}
          >
            Finalizar Rascunho
          </Button>
        }

        <Button 
          type="primary" 
          style={{marginRight: '10px'}}
          onClick={this.onSaveOrdem}
          loading={this.state.saving}
        >
          Salvar Ordem
        </Button>

        <Button 
          disabled={this.state.saving}
          onClick={this.onCancelarClick}
        >
          Cancelar
        </Button>
      </div>
    )
  }

  onSaveOrdem = () => {
    this.setState({ saving: true}, () => {
      this.props.saveOrdem({
        responseHandler: {
          successCallback: this.onSaveSuccess,
          errorCallback: this.onSaveError,
          validationErrorCallback: this.onValidationError
        }
      })
    })
  }

  onSaveSuccess = (ordemId) => {    
    this.setState({ saving: false, errorsList: [] }, () => {
      message.success("Ordem salva com sucesso!");
      this.props.onAfterSave(ordemId);
    });
  }

  onSaveError = (what) => {
    message.error(what);
    this.setState({ saving: false, errorsList: [] });
  }

  onValidationError = (errorsList) => {
    message.error("Foram identificados erros no preenchimento desta O.S!");
    this.setState({ saving: false, errorsList});
  }

  renderDadosBasicos = () => {
    if (this.state.saving) {
      return (
        <div style={{ height: "600px"}}>
          <div style={{paddingLeft: "20px"}}>
            <Alert message="Salvando os dados da ordem de serviço..." type="info" showIcon />
          </div>
          <PageLoading />
        </div>
      )
    } else if (this.state.finalizandoRascunho) {
      return (
        <div style={{ height: "600px"}}>
          <div style={{paddingLeft: "20px"}}>
            <Alert message="Finalizando o rascunho desta ordem de serviço. Favor aguardar alguns instantes." type="info" showIcon />
          </div>
          <PageLoading />
        </div>
      )
    } else {
      return (
        <div>
          { (this.state.errorsList.length > 0) && 
            <div style={{ marginBottom: "15px", paddingLeft: "10px", paddingRight: "10px"}}>
              <AlertList 
                title="Erros identificados no preenchimento desta Ordem de Serviço" 
                messagesList={this.state.errorsList} 
                closable
              />
            </div>
          }
          <AbaDadosBasicos />
        </div>
      )
    }
  }

  onFinalizarRascunho = () => {
    this.setState({ saving: true}, () => {
      this.props.saveOrdem({
        responseHandler: {
          successCallback: () => {
            this.setState({ saving: false, errorsList: []}, () => {
              this.onExecuteFinalizaRascunho()
            });
          },
          errorCallback: this.onSaveError,
          validationErrorCallback: this.onValidationError
        }
      })
    })
  }

  onExecuteFinalizaRascunho = () => {
    let idOrdem = this.props.idOrdem;

    Modal.confirm({
      title: 'Confirmar Finalizar Rascunho',
      centered: true,
      width: 600,
      content: <span>Tem certeza que deseja finalizar o rascunho?<br /><br />
                <strong>Obs:</strong> A edição da ordem será finalizada e um e-mail será enviado para cada um dos designantes solicitando à assinatura da ordem.
               </span>,
      onOk: () => {
        this.setState({ finalizandoRascunho: true}, () => {
          this.props.finalizarRascunho(idOrdem, {
            successCallback: () => { 
              message.success("Rascunho finalizado com sucesso!")
              history.push('/ordemserv/minhas-ordens');
            },
            errorCallback: (what) => { 
              message.error(what);
              this.setState({ finalizandoRascunho: false});
            }
          })
        });
      },
      onCancel: () => {
        message.info("Finalização do rascunho cancelada.");
      },
    });
  }

  render() {
    return (
      <Tabs type="card" tabBarExtraContent={this.renderActions()}>
        <TabPane key="1" disabled={this.state.saving} tab={<TabLabel>Dados Básicos</TabLabel>}>
          {this.renderDadosBasicos()}
        </TabPane>
        <TabPane key="2" disabled={this.state.saving} tab={<TabLabel>Colaboradores</TabLabel>}>
          {!this.state.saving && <Colaboradores />}
        </TabPane>
        { this.props.estado === ESTADOS.VIGENTE &&
          <TabPane key="3" disabled={this.state.saving} tab={<TabLabel>Autorizações de Consulta</TabLabel>}>
            <AutorizacaoConsulta />
          </TabPane>
        }
        { this.props.estado === ESTADOS.VIGENTE &&
          <TabPane key="4" disabled={this.state.saving} tab={<TabLabel>Link Público</TabLabel>}>
            <LinkPublico />
          </TabPane>
        }
      </Tabs>
    )
  }
  
}

export default connect(null, {
  saveOrdem,
  finalizarRascunho
})(OrdemForm);
