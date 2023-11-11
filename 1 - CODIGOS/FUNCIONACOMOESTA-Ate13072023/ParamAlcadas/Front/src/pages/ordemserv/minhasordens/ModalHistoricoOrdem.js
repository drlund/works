import React, { Component } from 'react'
import {message, Row, Col, Button, Modal} from 'antd';
import HistoricoOrdemComponent from './HistoricoOrdemComponent';
import { findHistoricoOrdem } from 'services/ducks/OrdemServ.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import { connect } from 'react-redux';

class ModalHistoricoOrdem extends Component {
  state = {
    dadosHistorico: [],
    fetching: true
  }

  componentDidUpdate(prevProps) {
    if (this.props.idOrdem !== null && prevProps.idOrdem !== this.props.idOrdem) {
      this.fetchDadosModal(this.props.idOrdem);
    }
  }

  renderModal = () => {
    let modalContent = null;

     if (this.state.fetching) {
       modalContent = <div style={{minHeight: 700}}><PageLoading /></div>
     } else {
      modalContent =         
      <Row>
        <Col span={24}>
          <HistoricoOrdemComponent dadosHistorico={this.state.dadosHistorico} />
        </Col>
      </Row>
     }

    return (
      <Modal 
      title="Histórico da Ordem de Serviço"
        key={this.props.modalKey}
        visible={this.props.visible}
        width="70%"
        centered
        bodyStyle={{paddingTop: 10, minHeight: 700}}
        destroyOnClose
        maskClosable={false}
        footer={<Button type="danger" onClick={this.props.closeModal}>Fechar</Button>}
        onCancel={this.props.closeModal}
      >
        {modalContent}
      </Modal>
    )
  }

  fetchDadosModal = (idOrdem) => {
    if (idOrdem) {
      this.setState({dadosHistorico: [], fetching: true}, () => {
        //busca os dados da ordem para visualizacao
        this.props.findHistoricoOrdem(idOrdem)
        .then( (dadosHistorico) => {
          this.setState({fetching: false, dadosHistorico});
        })
        .catch( (error) => {
          message.error(error);
          this.props.closeModal();
        })
      });
    }
  }

  render() {
    return (this.renderModal())
  }
}

export default connect(null, {
  findHistoricoOrdem
})(ModalHistoricoOrdem);