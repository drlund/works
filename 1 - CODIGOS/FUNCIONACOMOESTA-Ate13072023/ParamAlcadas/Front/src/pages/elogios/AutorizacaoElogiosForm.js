import React, { Component } from 'react'
import { Tabs, Modal, Button } from 'antd';
import ElogiosPendentesForm from './ElogiosPendentesForm';
import ElogiosAutorizadosForm from './ElogiosAutorizadosForm';
import VisualizarElogio from './VisualizarElogioForm';
import styled from 'styled-components';
import history from "@/history.js";
import uuid from 'uuid/v4';

const TabPane = Tabs.TabPane;

const TabLabel = styled.label`
  color: !important;
  cursor: pointer;
  color: ${props => props.hasError && "red"}
`;

class AutorizacaoElogiosForm extends Component {
  state = {
    modalVisible: false,
    modalKey: uuid(),
    idElogio: null,
    canEdit: false
  }

  renderModal = () => {
    let arrButtons = [];

    if (this.state.canEdit) {
      arrButtons.push(
        <Button 
          key="submit" 
          type="primary"           
          onClick={this.onEditarRegistro}
        >
          Editar
        </Button>
      )
    }

    arrButtons.push(
      <Button 
        key="back" 
        onClick={this.onModalClose}
      >
        Fechar
      </Button>
    )

    return (
      <Modal
        visible={this.state.modalVisible}
        title="Visualizar Elogio"
        key={this.state.modalKey}
        centered
        width={900}
        onCancel={this.onModalClose}
        maskClosable={false}
        footer={arrButtons}
      >
        <VisualizarElogio idElogio={this.state.idElogio} />
      </Modal>
    )
  }

  onVisualizarElogio = (idElogio, canEdit) => {
    this.setState({ modalVisible: true, modalKey: uuid(), idElogio, canEdit });
  }

  onModalClose = () => {
    this.setState({ modalVisible: false });
  }

  onEditarRegistro = () => {
    history.push('/elogios/editar-elogio/' + this.state.idElogio);
  }

  render() {
    return (
      <div>
        <Tabs type="card">
          <TabPane tab={<TabLabel>Pendentes</TabLabel>} 
            key={1}
          >
            <ElogiosPendentesForm onVisualizarElogio={this.onVisualizarElogio} />
          </TabPane>

          <TabPane tab={<TabLabel>Autorizados</TabLabel>} 
            key={2}
          >
            <ElogiosAutorizadosForm onVisualizarElogio={this.onVisualizarElogio} />
          </TabPane>

        </Tabs>

        {this.renderModal()}
      </div>
    )
  }
}

export default AutorizacaoElogiosForm;