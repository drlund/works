import React, { Component } from 'react';
import PageLoading from 'components/pageloading/PageLoading';
import { connect } from 'react-redux';
import { Row, Col, Button, message } from 'antd';
import { fetchEstoque } from 'services/ducks/Encantar.ducks';
import PrefixoInfo from './PrefixoInfo';
import Estoque from './Estoque';
import history from "@/history.js";
class EstoqueVerExcluir extends Component {
  state = {
    loading: true,
    brindes: [],
    estoque: [],
    showModalBrindeNovo: false,
    acao: null,
  }

  componentDidMount() {
    this.atualizaEstoque();
  }
  
  atualizaEstoque = () => {
    this.props.fetchEstoque(this.props.session.prefixo).then(
      () => {
        this.setState({ 
          loading: false,
          estoque: this.props.estoque,
        })
      }
    )
  }

  setModalBrindeNovo = (show) => {
    this.setState({ showModalBrindeNovo: show })
  }
  setAcao = (tipo) => {
    this.setState({ acao: tipo })
  }
  
  render() {
    if (this.state.loading) {
      return <PageLoading />
    }
    return (
      <>
        <PrefixoInfo />
        <Row style={{ marginTop: 1 }} gutter={[0, 32]}>
          <Col style={{textAlign: 'center'}}>
            <Button type="primary" onClick={() => history.push('/encantar/incluirBrinde')}>
              Gerenciar Catálogo
            </Button>
          </Col>
        </Row>
        <Row>
          <Col style={{display: 'flex', flexFlow: 'row wrap', justifyContent: 'center'}}>
            <Estoque 
              brindes={this.state.brindes}
              estoque={this.state.estoque}
              acao={this.state.acao}
              setAcao={this.setAcao}
              showModalBrindeNovo={this.state.showModalBrindeNovo}
              setModalBrindeNovo={this.setModalBrindeNovo}
              atualizaEstoque={this.atualizaEstoque}
              />
          </Col>
        </Row>
      </>
    )
  }
}

const mapStateToProps = state => {
  return { 
    estoque: state.encantar.estoque,
    session: state.app.authState.sessionData
  }
}

export default connect(mapStateToProps, { fetchEstoque })(EstoqueVerExcluir);