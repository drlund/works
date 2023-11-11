import React, { Component } from 'react';
// import { connect } from 'react-redux';
import { salvarBrinde, apagaBrinde } from 'services/ducks/Encantar.ducks';

import { message, Row, Col } from 'antd';
import CardBrinde from './CardBrinde';

class Estoque extends Component {

  state = {
    brindeTipo: null,
    brindeQtd: null,
    showModalBrinde: null,
    croppedImage: null,
    novoTitulo: null,
    novaQtde: null,
    novaDescricao: null,
    spin: true,
    // showModalCardExcluir: false,
    qtdeExcluir: null,
    justificativa: null
  }

  
  setNovoTitulo = (valor) => {
    this.setState({ novoTitulo: valor })
  }
  setNovaDescricao = (valor) => {
    this.setState({ novaDescricao: valor })
  }
  setNovaQtde = (tipo, valor = null , qtdeExcluir = null, qtdeAnterior = null) => {
    if (tipo === 'incluir') {
      this.setState({ novaQtde: valor })
    } else {
      if (qtdeAnterior - qtdeExcluir >= 0) {
        let novoValor = qtdeAnterior - qtdeExcluir;
        this.setQtdeExcluir(qtdeExcluir, novoValor);
      } else if (qtdeExcluir && qtdeAnterior) {
        message.error('Não é possível baixar uma quantidade maior que a disponível em estoque.', 8);
      }
    }
  }
  setModalBrinde = (show) => {
    this.setState({ showModalBrinde: show })
    // this.props.setModalBrindeNovo(show)
  }
  // setModalBrindeNovo = (show) => {
  //   this.setState({ showModalCardIncluir: show })
  // }
  setModalCropper = (show) => {
    this.setState({ showModalCropper: show });
  };
  // função de callback que recebe a imagem ajustada
  getCroppedImage = (croppedImage) => {
    this.setState({ croppedImage })
  }
  // setModalCardExcluir = (show) => {
  //   this.setState({ showModalCardExcluir: show })
  // }
  setQtdeExcluir = (valorExcluir, novaQtde) => {
    this.setState({ qtdeExcluir: valorExcluir, novaQtde: novaQtde })
  }
  setJustificativa = (texto) => {
    this.setState({ justificativa: texto })
  }
  salvarBrinde = async (idBrinde, nome, descricao, base64, tipo, quantidade, observacao, inexistente, salvarTipo) => {
    let brinde = await salvarBrinde(
      {
        idBrinde,
        nome,
        descricao,
        base64,
        tipo,
        quantidade,
        observacao,
        inexistente
      }
    );
    
    if (brinde.erro) {
      message.error(brinde.msg, 8);

      // modal excluir
    // } else if (salvarTipo === 'excluir') {
    } else {
      this.setModalBrinde(false)
      // this.setModalCardExcluir(false)
      this.setQtdeExcluir(null, null)
      this.setJustificativa(null)
      
      this.getCroppedImage(null)
      this.setNovoTitulo(null)
      this.setNovaQtde(salvarTipo)
      this.setNovaDescricao(null)

      message.success(brinde.msg, 8);

      // modal novo brinde
    // } else if (salvarTipo === 'incluir') {
    }
    if(this.props.atualizaEstoque) this.props.atualizaEstoque();
    if(this.props.atualizaListaBrinde) this.props.atualizaListaBrinde();
  }

  excluirBrinde = async (idBrinde, qtde) => {
    let brinde = {};
    if(qtde) {
      brinde.erro = true;
      brinde.msg = 'Não é possível remover este item, ele possui estoque em algum prefixo.'
    } else {
      brinde = await apagaBrinde(idBrinde);
    }

    if(brinde.erro) {
      message.error(brinde.msg, 8);
    } else {
      message.success(brinde.msg, 8);
      this.setModalBrinde(false)
    }
    this.props.atualizaListaBrinde();
  }

  render() {
    return (
      <Row justify='center' style={{ margin: 8, flexDirection: 'column' }}>
        <Col style={{ display: 'flex', flexFlow: 'row wrap', justifyContent: 'center' }}>
          <CardBrinde
            brindes={this.props.brindes}
            estoque={this.props.estoque}
            acao={this.props.acao}
            setAcao={this.props.setAcao}
            showModalBrindeNovo={this.props.showModalBrindeNovo}
            setModalBrindeNovo={this.props.setModalBrindeNovo}
            showModalBrinde={this.state.showModalBrinde}
            setModalBrinde={this.setModalBrinde}
            croppedImage={this.state.croppedImage}
            getCroppedImage={this.getCroppedImage}
            setModalCropper={this.setModalCropper}
            novaQtde={this.state.novaQtde}
            setNovaQtde={this.setNovaQtde}
            qtdeExcluir={this.state.qtdeExcluir}
            setQtdeExcluir={this.setQtdeExcluir}
            justificativa={this.state.justificativa}
            setJustificativa={this.setJustificativa}
            novoTitulo={this.state.novoTitulo}
            setNovoTitulo={this.setNovoTitulo}
            novaDescricao={this.state.novaDescricao}
            setNovaDescricao={this.setNovaDescricao}
            salvarBrinde={this.salvarBrinde}
            excluirBrinde={this.excluirBrinde}
          />
        </Col>
      </Row>
    )
  }
}

export default Estoque;
