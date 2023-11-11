import React, { Component } from 'react';
import { fetchBrindesExistentes } from 'services/ducks/Encantar.ducks';

import { connect } from 'react-redux';
import {
  Row,
  Col,
  Button,
  Typography,
  Pagination,
  Spin,
} from 'antd';
import PrefixoInfo from 'pages/encantar/estoque/PrefixoInfo';
import Estoque from './Estoque';

const { Title } = Typography;
class EstoqueIncluir extends Component {

  state = {
    brindes: [],
    estoque: [],
    spin: true,
    page: 1,
    pageSize: 4,
    showModalBrindeNovo: false,
    acao: null,
  }

  componentDidMount() {
    this.atualizaListaBrinde();
  }
  
  // carregar a exibição da lista de brindes existentes
  exibePag = (page, pageSize) => {
    let posicaoAtual = page * pageSize;
    let posicaoAnterior = (page - 1) * pageSize;
    this.setState({ 
      page: page,
      pageSize: pageSize,
      brindes: this.props.brindes.slice(posicaoAnterior, posicaoAtual) 
    })
  }
  
  atualizaListaBrinde = () => {
    this.props.fetchBrindesExistentes().then(
      () => {
        this.exibePag(this.state.page, this.state.pageSize)
        this.setState({ spin: false })
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
    return (
      <Row>
        <Col>
          <Row style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
            <Col>
              <PrefixoInfo btn={true}/>
            </Col>
          </Row>

          <Row style={{ marginTop: 1, justifyContent: 'center', flexDirection: 'column' }}>
            <Col>
              <Row justify='center' style={{ margin: 8 }}>
                <Title level={4}>Escolha um item do catálogo para adicioná-lo ao seu estoque.</Title>
              </Row>
              {this.state.spin
                ? <Row>
                  <Col style={{ textAlign: 'center' }}>
                    <Spin tip="Carregando Lista..." />
                  </Col>
                </Row>
                : this.state.brindes.length ?
                  <Row justify='center' style={{ margin: 8, flexDirection: 'column' }}>
                    <Col style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <Estoque 
                        brindes={this.state.brindes}
                        estoque={this.state.estoque}
                        acao={this.state.acao}
                        setAcao={this.setAcao}
                        showModalBrindeNovo={this.state.showModalBrindeNovo}
                        setModalBrindeNovo={this.setModalBrindeNovo}
                        atualizaListaBrinde={this.atualizaListaBrinde}
                        />
                    </Col>
                    <Col style={{ textAlign: 'center' }}>
                      <Pagination
                        onChange={this.exibePag}
                        defaultPageSize={4}
                        pageSizeOptions={[3, 4, 5, 10, 20, 50, 100]}
                        showSizeChanger={true}
                        onShowSizeChange={this.exibePag}
                        total={this.props.brindes.length}
                      />
                    </Col>
                  </Row>
                  : <Row>
                    <Col style={{ textAlign: 'center' }}>
                      Sem itens para exibir
                    </Col>
                  </Row>
              }
            </Col>
          </Row>
          <Row style={{ marginTop: 1, justifyContent: 'center', flexDirection: 'column' }} gutter={[16, 32]}>
            <Col style={{ paddingBotton: 0, textAlign: 'center' }}>
              <Title level={4}>Não encontrou seu brinde? Adicione você mesmo ao catálogo.</Title>
            </Col>
            <Col offset={10} span={4} style={{ textAlign: 'center', padding: 0 }}>
              <Button type="primary" onClick={() => { 
                this.setModalBrindeNovo(true) 
                this.setAcao('novo')
              }}>
                Novo Brinde
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    )
  }
}

const mapStateToProps = state => {
  return { brindes: state.encantar.brindes }
}

export default connect(mapStateToProps, { fetchBrindesExistentes })(EstoqueIncluir);