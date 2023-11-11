import React, { Component } from 'react'
import {message, Row, Col, Button, Modal} from 'antd';
import VisualizarOrdemComponent from './VisualizarOrdemComponent';
import { fetchVisualizarOrdem, fetchVisualizarOrdemEstoque } from 'services/ducks/OrdemServ.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import { verifyPermission } from 'utils/Commons';
import { connect } from 'react-redux';

class ModalVisualizarOrdem extends Component {
  state = {
    fetching: true
  }

  componentDidUpdate(prevProps) {
    if (!this.props.idHistorico && (this.props.idOrdem !== null && prevProps.idOrdem !== this.props.idOrdem)) {
      this.fetchDadosModal(this.props.idOrdem);
    } else if (this.props.idHistorico !== null && prevProps.idHistorico !== this.props.idHistorico) {
      this.fetchDadosModalEstoque(this.props.idOrdem, this.props.idHistorico)
    }
  }

  renderModal = () => {
    if (this.props.idOrdem === null) {
      return null
    }

    let modalContent = null;

     if (this.state.fetching) {
       modalContent = <div style={{minHeight: 700}}><PageLoading /></div>
     } else {

      const hasPrintPdfPermission = verifyPermission({
        ferramenta: 'Ordem de Serviço',
        permissoesRequeridas: ['IMPRIMIR_PDF'],
        authState: this.props.authState
      });

      modalContent =         
      <Row>
        <Col span={24}>
          <VisualizarOrdemComponent 
            dadosOrdem={this.props.dadosOrdem} 
            dataHistoricoOrdem={this.props.dataHistoricoOrdem}
            permiteImpressaoPdf={hasPrintPdfPermission}
            config={{
              mostrarDesignantes:true, 
              modoEdicaoDesignantes: false,
              mostrarDesignados:true,
              modoEdicaoDesignados: false
            }}
          />
        </Col>
      </Row>
     }

    return (
      <Modal 
      title="Visualizar Ordem de Serviço"
        key={this.props.modalKey}
        visible={this.props.visible}
        width="80%"
        style={{minWidth: 1130}}
        centered
        bodyStyle={{paddingTop: 10, minHeight: 700, minWidth: 1130}}
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
      this.setState({fetching: true}, () => {
        //busca os dados da ordem para visualizacao
        this.props.fetchVisualizarOrdem(idOrdem)
        .then( () => {
          this.setState({fetching: false});
        })
        .catch( (error) => {
          message.error(error);
          this.props.closeModal();
        })
      });
    }
  }

  fetchDadosModalEstoque = (idOrdem, idHistorico) => {
    if (idOrdem && idHistorico) {
      this.setState({fetching: true}, () => {
        //busca os dados da ordem para visualizacao
        this.props.fetchVisualizarOrdemEstoque(idOrdem, idHistorico)
        .then( () => {
          this.setState({fetching: false});
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

function mapStateToProps(state) {
  return { 
    dadosOrdem: state.ordemserv.ordemAtual,
    authState: state.app.authState
  };
}

export default connect(mapStateToProps, {
  fetchVisualizarOrdem,
  fetchVisualizarOrdemEstoque
})(ModalVisualizarOrdem);