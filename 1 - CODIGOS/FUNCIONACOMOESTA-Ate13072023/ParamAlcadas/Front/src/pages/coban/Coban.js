import React, { Component } from 'react';
import { connect } from 'react-redux';

import FormCoban from './formCoban';
import TextoCabec from './TextoCabec';
import PageLoading from '../../components/pageloading/PageLoading';

import { novaIndicacaoCoban, fetchTexto } from 'services/ducks/Coban.ducks';

import { message, Modal } from 'antd';

// import { Container } from './styles';

class Coban extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fetchingTex: false,
      saving: false,
    }
  }

  componentDidMount() {
    this.fetchAllList();
  }

  fetchAllList = () => {
    this.setState({fetchingTex: true}, () => {
      this.props.fetchTexto({
        responseHandler: {
          successCallback: () => {
            this.setState({fetchingTex: false})
          },
          errorCallback: () => {
            message.error('Não foi possível carregar as informações do texto. Por favor, recarregue a página!')
          }
        }
      })
    })
  }

  sendIndicacao = values => {
    this.setState({saving: true}, () => {
      this.props.novaIndicacaoCoban({
        dados: values,
        responseHandler: {
          successCallback: this.indicacaoSucesso,
          errorCallback: (mensagem) => {
            if (mensagem === 'cnpjexiste') {
              const modalErro = () => {
                let secondsToGo = 5;
                const modal = Modal.error({
                  title: 'Erro na Indicação de COBAN',
                  content: 'O CNPJ já foi indicado anteriormente!',
                });
                setTimeout(() => {
                  modal.destroy();
                }, secondsToGo * 1000);
              }
              modalErro();
            } else {
              message.error('Não foi possível carregar as informações da página. Por favor, recarregue a página!');
            }
          }
        }
      })
    })
  }


  indicacaoSucesso = () => {
    this.setState({saving: false});
    const modal = () => {
      let secondsToGo = 5;
      const modal = Modal.success({
        title: 'Nova Indicação de COBAN',
        content: 'A Indicação do COBAN foi realizada com sucesso!!',
      });

      setTimeout(() => {
        modal.destroy();
      }, secondsToGo * 1000);
      this.fetchAllList();
    }

    return modal();
  }

  render() {
    if (this.state.fetchingTex) {
      return <PageLoading />;
    }

    return (
      <div style={{width: "90%", margin: "auto"}}>
        <TextoCabec texto={this.props.texto}/>
        <FormCoban
          novaIndicacaoCoban={this.sendIndicacao}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    texto: state.coban.texto
  }
}

export default connect(mapStateToProps, {
  novaIndicacaoCoban,
  fetchTexto
})(Coban);