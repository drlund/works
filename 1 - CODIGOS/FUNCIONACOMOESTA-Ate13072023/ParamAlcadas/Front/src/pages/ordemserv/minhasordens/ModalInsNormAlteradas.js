import React, { Component } from 'react'
import {message, Row, Col, Button, Modal} from 'antd';
import InsNormAlteradas from './InsNormAlteradasComponent';
import { findInsAlteradasOrdem } from 'services/ducks/OrdemServ.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import { connect } from 'react-redux';

class ModalInsNormAlteradas extends Component {
  state = {
    dadosAlteracoes: {},
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
          <InsNormAlteradas 
            idOrdem={this.props.idOrdem}
            dadosAlteracoes={this.state.dadosAlteracoes}
            closeModal={this.onModalClosed}
            atualizarPesquisa={this.props.atualizarPesquisa}
          />
        </Col>
      </Row>
     }

    return (
      <Modal 
        title="Alterações nas Instruções Normativas"
        key={this.props.modalKey}
        visible={this.props.visible}
        width="70%"
        centered
        bodyStyle={{paddingTop: 10, paddingBottom: 10, minHeight: 700}}
        destroyOnClose
        maskClosable={false}
        footer={<Button type="danger" onClick={this.onModalClosed}>Fechar</Button>}
        onCancel={this.onModalClosed}
      >
        {modalContent}
      </Modal>
    )
  }

  onModalClosed = () => {
    this.props.closeModal();
  }

  fetchDadosModal = (idOrdem) => {
    if (idOrdem) {
      this.setState({dadosAlteracoes: {}, fetching: true}, () => {
        this.props.findInsAlteradasOrdem(idOrdem)
        .then( (dadosAlteracoes) => {
          if (dadosAlteracoes.instrucoesNorm.length) {
            this.setState({fetching: false, dadosAlteracoes});
          } else {
            message.error('Nenhuma instrução normativa alterada nesta ordem!');
            this.onModalClosed();
          }
        })
        .catch( (error) => {
          message.error(error);
          this.onModalClosed();
        })
      });
    }
  }

  render() {
    return (this.renderModal())
  }
}

export default connect(null, {
  findInsAlteradasOrdem
})(ModalInsNormAlteradas);