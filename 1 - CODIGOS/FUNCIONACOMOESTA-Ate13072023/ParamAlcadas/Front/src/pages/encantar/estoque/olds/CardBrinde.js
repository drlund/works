import React, { Component } from 'react';
import ModalBrinde from './ModalBrinde';
import { Card, Avatar, Button, Row, Col } from 'antd';

class CardBrinde extends Component {
  state = {
    idBrinde: null,
    titulo: null,
    descricao: null,
    quantidade: null,
    justificativa: null
  }

  dadosModal = (idBrinde, titulo, descricao, quantidade, tipo) => {
    this.setState({ 
      idBrinde,
      titulo, 
      descricao,
      quantidade,
    });
    this.props.setAcao(tipo);
    this.props.setModalBrinde(true);
  }

  render() {
    let itens = [];
    if(this.props.brindes.length) {
      itens = this.props.brindes 
    } else {
      itens = this.props.estoque
    }
    return (
      <>
        {itens.map((item) => {
          return (
            <Card
              key={item.id}
              title={item.nome}
              headStyle={{ padding: 0, textAlign: 'center' }}
              bodyStyle={{ padding: 0, display: 'block' }}
              style={{ width: 200, margin: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between'  }}
              cover={<Avatar style={{ marginInline: 'auto', marginTop: 4 }} shape="square" size={190} alt={item.descricao} src={`${process.env.REACT_APP_ENDPOINT_API_URL}/encantar/brinde-img/${item.id}`} />}
              actions={[
                  
              ]}
            >
              <p style={{ marginBlock: 4, textAlign: 'center' }}>{item.descricao}</p>
              { this.props.estoque.length > 0 &&
                <p style={{ marginBlock: 4, textAlign: 'center' }}>{`Quantidade: ${item.quantidade}`}</p>
              }
              <ModalBrinde
                acao={this.props.acao}
                showModalBrindeNovo={this.props.showModalBrindeNovo} 
                setModalBrindeNovo={this.props.setModalBrindeNovo} 
                showModalBrinde={this.props.showModalBrinde} 
                setModalBrinde={this.props.setModalBrinde}
                idBrinde={this.state.idBrinde}
                croppedImage={this.props.croppedImage}
                getCroppedImage={this.props.getCroppedImage}
                setModalCropper={this.props.setModalCropper}
                titulo={this.state.titulo}
                novoTitulo={this.props.novoTitulo}
                setNovoTitulo={this.props.setNovoTitulo}
                descricao={this.state.descricao}
                novaDescricao={this.props.novaDescricao}
                setNovaDescricao={this.props.setNovaDescricao}
                quantidade={this.state.quantidade}
                novaQtde={this.props.novaQtde}
                setNovaQtde={this.props.setNovaQtde}
                qtdeExcluir={this.props.qtdeExcluir}
                setQtdeExcluir={this.props.setQtdeExcluir}
                justificativa={this.props.justificativa}
                setJustificativa={this.props.setJustificativa}
                salvarBrinde={this.props.salvarBrinde}
                excluirBrinde={this.props.excluirBrinde}
              />
              <Row style={{ paddingBlock: 6 }}>
                <Col style={{ paddingInline: 5 }}>
                  <Button
                    block
                    style={{ margin: 2 }}
                    type="primary"
                    onClick={ () => {this.dadosModal(item.id, item.nome, item.descricao, null, 'incluir')} }
                  >
                    Incluir Estoque
                  </Button>
                  { this.props.estoque.length ?
                    <Button
                      block
                      style={{ margin: 2 }}
                      type="primary"
                      onClick={ () => {this.dadosModal(item.id, item.nome, item.descricao, item.quantidade, 'excluir')} }
                      >
                      Baixar Estoque
                    </Button>
                  : 
                    !item.quantidade &&
                    <Button
                      block 
                      style={{ margin: 2 }}
                      type="primary"
                      onClick={ () => {this.dadosModal(item.id, item.nome, item.descricao, item.quantidade, 'softDelete')} }
                      >
                      Excluir do catálogo
                    </Button>
                  }
                </Col>
              </Row>
            </Card>
          )
        })}
      </>
    )
  }
}

export default CardBrinde;