import React, { Component } from 'react'
import {message, Row, Col, Button, Modal} from 'antd';
import AcompanhamentoOrdem from './AcompanhamentoOrdem';
import { findAcompanhamentoOrdem } from 'services/ducks/OrdemServ.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import { connect } from 'react-redux';

class ModalAcompOrdem extends Component {
  state = {
    dadosAcompanhamento: [],
    fetching: true
  }

  componentDidUpdate(prevProps) {
    if (this.props.idOrdem !== null && prevProps.idOrdem !== this.props.idOrdem) {
      this.fetchDadosOrdem(this.props.idOrdem);
    }
  }

  renderModalAcompanhamento = () => {
    let modalContent = null;

     if (this.state.fetching) {
       modalContent = <div style={{minHeight: 700}}><PageLoading /></div>
     } else {
      modalContent =         
      <Row>
        <Col span={24}>
          <AcompanhamentoOrdem dadosAcompanhamento={this.state.dadosAcompanhamento} />
        </Col>
      </Row>
     }

    return (
      <Modal 
        title="Acompanhamento da Ordem de Serviço"
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

  fetchDadosOrdem = (idOrdem) => {
    if (idOrdem) {
      this.setState({dadosAcompanhamento: [], fetching: true}, () => {
        //busca os dados da ordem para visualizacao
        this.props.findAcompanhamentoOrdem(idOrdem)
        .then( (dadosAcompanhamento) => {
          this.setState({fetching: false, dadosAcompanhamento});
        })
        .catch( (error) => {
          message.error(error);
          this.props.closeModal();
        })
      });
    }
  }

  render() {
    return (this.renderModalAcompanhamento())
  }
}

export default connect(null, {
  findAcompanhamentoOrdem
})(ModalAcompOrdem);