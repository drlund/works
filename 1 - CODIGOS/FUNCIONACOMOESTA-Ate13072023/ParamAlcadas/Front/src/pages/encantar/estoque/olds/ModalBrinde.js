import React, { Component } from 'react';
import Formularios from './Formularios';
import { Button, Modal, message } from 'antd';

class ModalBrinde extends Component {
  getDadosComponente() {
    let dados = {
      tipoAcao: this.props.acao,
      gravar: false,
      idBrinde: this.props.idBrinde,
      base64: null,
      titulo: this.props.titulo,
      descricao: this.props.descricao,
      novaQtde: this.props.novaQtde,
      quantidade: this.props.quantidade,
      justificativa: this.props.justificativa,
      tipoLancto: 0,
      flag: false,
      tituloModal: null,
      msgErro: null
    };
    switch (this.props.acao) {
      case 'incluir':
        dados.tipoLancto = 1;
        dados.tituloModal = 'Informe a quantidade à incluir no estoque. Informe somente números.';
        dados.msgErro = 'Os campos "Quantidade" e "Justificativa" são obrigatórios. Informe somente números na quantidade.';
        if(this.props.novaQtde && this.props.justificativa) dados.gravar = true;
        break;
        case 'excluir':
          dados.tipoLancto = 2;
          dados.novaQtde = this.props.qtdeExcluir*(-1);
          dados.tituloModal = "Informe a quantidade à excluir do estoque. Informe somente números.";
          dados.msgErro = 'Os campos "Quantidade a excluir" e "Justificativa" são obrigatórios. Informe somente números na quantidade.';
          if(this.props.qtdeExcluir && this.props.justificativa) dados.gravar = true;
          break;
        case 'novo':
          dados.tipoLancto = 1;
          dados.titulo = this.props.novoTitulo;
          dados.descricao = this.props.novaDescricao;
          dados.justificativa = 'Cadastramento com quantidade de um brinde novo.';
          dados.base64 = this.props.croppedImage;
          dados.flag = true;
          dados.tituloModal = 'Preencha os dados do novo brinde';
          if(this.props.croppedImage && this.props.novoTitulo && 
            this.props.novaDescricao && this.props.novaQtde) {
              dados.gravar = true;
            } else if(!dados.base64) {
              dados.msgErro = 'Escolha uma imagem para o brinde.';
            } else {
              dados.msgErro = 'Todos os campos devem ser preenchidos. Informe somente números na quantidade.'
            }
          break;
        case 'softDelete':
          dados.tituloModal = 'Remover Brinde do catálogo';
          break;
    }
    return dados;
  }

  render() {
    const dados = this.getDadosComponente();
    return (
      <Modal
        bodyStyle={{ padding: 16 }}
        title={dados.tituloModal}
        visible={this.props.showModalBrinde || this.props.showModalBrindeNovo}
        onCancel={ () => { 
          this.props.setModalBrinde(false) 
          this.props.setModalBrindeNovo(false)
        }}
        width={600}
        footer={[
          <Button key="cancelar" danger onClick={() => { 
            this.props.setModalBrinde(false)
            this.props.setModalBrindeNovo(false)
            this.props.setNovaQtde(null)
            this.props.setQtdeExcluir(null, null)
            this.props.setJustificativa(null)
            this.props.getCroppedImage(null)
            this.props.setNovoTitulo(null)
            this.props.setNovaDescricao(null)
          }}>
            Cancelar
          </Button>,
          this.props.acao !== 'softDelete' ? 
            <Button key="gravar" type="primary" onClick={ () => {
              if(dados.gravar) {
                this.props.salvarBrinde(
                  dados.idBrinde,
                  dados.titulo, 
                  dados.descricao,
                  dados.base64, // base64
                  dados.tipoLancto, // tipo inclusão
                  dados.novaQtde, //quantidade
                  dados.justificativa, // observação
                  dados.flag, // flag inexistente
                  dados.tipoAcao, // salvarTipo (só no estoque.js)
                );
                this.props.setModalBrinde(false);
                this.props.setModalBrindeNovo(false);
              } else {
                message.error(dados.msgErro);
              }
            }}>
              Gravar
            </Button>
          :
            <Button key='delete' type="primary" onClick={ () => {
              this.props.excluirBrinde(dados.idBrinde, dados.quantidade)
            }}>
              Remover
            </Button>
        ]}
      >
        {this.props.acao !== 'softDelete' ? 
        <Formularios 
          acao={this.props.acao}
          croppedImage={this.props.croppedImage}
          getCroppedImage={this.props.getCroppedImage}
          setModalCropper={this.props.setModalCropper}
          titulo={this.props.titulo}
          novoTitulo={this.props.novoTitulo}
          setNovoTitulo={this.props.setNovoTitulo}
          descricao={this.props.descricao}
          novaDescricao={this.props.novaDescricao}
          setNovaDescricao={this.props.setNovaDescricao}
          quantidade={this.props.quantidade}
          novaQtde={this.props.novaQtde}
          setNovaQtde={this.props.setNovaQtde}
          qtdeExcluir={this.props.qtdeExcluir}
          setQtdeExcluir={this.props.setQtdeExcluir}
          justificativa={this.props.justificativa}
          setJustificativa={this.props.setJustificativa}
        />
        :
        <p>Você deseja remover este Brinde do catálogo? Nenhum outro Prefixo conseguirá mais utilizá-lo.</p>
        }
      </Modal>
    )
  }
}

export default ModalBrinde;