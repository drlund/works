import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import {
  Button, Modal, message, Row, Col, Typography, Drawer, Skeleton
} from 'antd';
import { RedoOutlined } from '@ant-design/icons';
import moment from 'moment';

import StyledCardPrimary from 'components/styledcard/StyledCardPrimary';
import SearchTable from 'components/searchtable/SearchTable';
import PageLoading from 'components/pageloading/PageLoading';
import DeAcordo from 'pages/designacao/Pendencias/DeAcordo';
import Movimentacao from 'pages/designacao/Pendencias/Movimentacao';
import { showPendencias } from 'services/ducks/Designacao.ducks';
import TabelaDesignacao from 'pages/designacao/Commons/TabelaDesignacao';

import './pendencias.css';
import 'pages/designacao/Commons/TabelaDesignacao.css';

const { Title } = Typography;

class Pendencias extends PureComponent {
  constructor(props) {
    super(props);

    this._isMounted = true;

    this.state = {
      searching: false,
      modalVisible: false,
      tipo: '',
      movimentacao: '',
      pendentes: '',
      modalWidth: '',
    };
  }

  componentDidMount() {
    this.mostraPendencias();
  }

  componentDidUpdate(prevProps) {
    const { tab } = this.props;
    if (prevProps.tab.key !== tab.key) {
      if (this._isMounted) {
        this.mostraPendencias();
      }
    }
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  mostraPendencias = () => {
    const { tab } = this.props;

    if (this._isMounted) {
      this.setState({ searching: true }, () => true);
    }

    showPendencias(tab.key)
      .then((pendentes) => this._isMounted && this.setState({ pendentes }))
      .catch((error) => message.error(error))
      .then(() => this._isMounted && this.setState({ searching: false }));
  };

  renderTabelaPendenciasAvisos = () => {
    const { tab } = this.props;
    const { pendentes, searching } = this.state;

    return (
      <SearchTable
        rowClassName={(record) => {
          if (((tab.key === '1' && record.self && !record.pendDeAcordo)) || (tab.key === '2' && record.enc)) {
            return 'table-row-self-color';
          }
          if (tab.key === '1' && record.self && record.pendDeAcordo) {
            return 'table-row-pend-color';
          }
          return '';
        }}
        columns={TabelaDesignacao({
          comp: 'pendencias',
          metodos: {
            visualizarDeAcordo: this.visualizarDeAcordo,
            visualizarMovimentacao: this.visualizarMovimentacao,
            visualizarSolicitacao: this.visualizarSolicitacao
          },
          tab
        })}
        locale={{
          emptyText: searching
            && (
              <>
                <Skeleton active />
                <Skeleton active />
                <Skeleton active />
              </>
            )
        }}
        dataSource={pendentes}
        size="small"
        loading={
          searching ? { spinning: searching, indicator: <PageLoading customClass="flexbox-row" /> } : false
        }
      />
    );
  };

  /**
   * ? Métodos para executar as ações
   */

  visualizarSolicitacao = (solicitacao) => {
    this.setState({
      movimentacao: { ...solicitacao }, consulta: true, modalVisible: true, tipo: 1, modalWidth: '60%', modo: 'drawer'
    }, () => true);
  };

  visualizarDeAcordo = ({ id }) => {
    this.setState({
      id_solicitacao: id, modalVisible: true, tipo: 2, modalWidth: '40%', modo: 'modal'
    }, () => true);
  };

  visualizarMovimentacao = (movimentacao) => {
    this.setState({
      movimentacao: { ...movimentacao }, modalVisible: true, tipo: 3, modalWidth: '90%', modo: 'drawer'
    }, () => true);
  };

  /**
   *  ? Modal para Visualizar demanda, histórico e assinar De Acordo
   */
  closeModal = () => {
    this.setState({
      modalVisible: false, movimentacao: {}, tipo: ''
    }, () => {
      Modal.destroyAll();
      this.mostraPendencias();
    });
  };

  conteudoModal = () => {
    const {
      tipo, movimentacao, consulta, id_solicitacao: idSolicitacao
    } = this.state;
    switch (tipo) {
      case 1:
        return (
          <Movimentacao
            key={1}
            movimentacao={movimentacao}
            parecer
            onClose={this.closeModal}
            consulta={consulta}
          />
        );
      case 2:
        return <DeAcordo id={idSolicitacao} key={2} onSave={this.closeModal} />;
      case 3:
        return (
          <Movimentacao
            key={3}
            movimentacao={movimentacao}
            parecer
            onClose={this.closeModal}
          />
        );
      default:
        return null;
    }
  };

  renderModal = () => {
    const {
      modo, modalWidth, modalVisible, consulta
    } = this.state;
    switch (modo) {
      case 'modal':
        return (
          <Modal
            width={modalWidth}
            visible={modalVisible}
            destroyOnClose
            maskClosable={false}
            onOk={this.closeModal}
            closable={false}
            onCancel={this.closeModal}
            footer={[
              <Button key={1} type="primary" onClick={this.closeModal}>
                OK
              </Button>,
            ]}
          >
            {this.conteudoModal()}
          </Modal>
        );
      case 'drawer':
        return (
          <Drawer
            height="95%"
            visible={modalVisible}
            title={(
              <Title
                level={3}
              >
                {consulta ? 'Visualizar' : 'Atualizar'}
                {' '}
                Solicitação de Movimentação
              </Title>
            )}
            bodyStyle={{ maxHeight: '100%', overflow: 'scroll' }}
            placement="bottom"
            destroyOnClose
            maskClosable
            closable={false}
            onClose={this.closeModal}
            footer={[
              <Row key={moment()}>
                <Col align="center">
                  <Button key={1} type="primary" size="large" onClick={this.closeModal}>
                    FECHAR
                  </Button>
                </Col>
              </Row>,
            ]}
          >
            {this.conteudoModal()}
          </Drawer>
        );
      default:
        return null;
    }
  };

  render() {
    const { tab } = this.props;
    return (
      <>
        <StyledCardPrimary
          title={(
            <Title level={3}>
              Quadro de Pendências
              {' '}
              {tab.quadro}
            </Title>
          )}
          style={{ minWidth: '1000' }}
        >
          <Row>
            <Col span={1} offset={23}>
              <Button onClick={this.mostraPendencias}><RedoOutlined /></Button>
            </Col>
          </Row>
          {this.renderTabelaPendenciasAvisos()}
        </StyledCardPrimary>
        {this.renderModal()}
      </>
    );
  }
}

export default connect(null, { showPendencias })(Pendencias);
