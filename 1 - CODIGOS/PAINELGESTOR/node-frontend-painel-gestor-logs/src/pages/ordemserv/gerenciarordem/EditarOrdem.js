import React, { Component } from 'react';
import OrdemForm from './OrdemForm';
import { connect } from 'react-redux';
import { fetchOrdemEdicao } from 'services/ducks/OrdemServ.ducks';
import PageLoading from 'components/pageloading/PageLoading';
import InfoLabel from 'components/infolabel/InfoLabel';
import { message } from 'antd';

class EditarOrdem extends Component {
  state = {       
    loading: true,
    found: true,
    errorMsg: "Ordem de Serviço não localizada na nossa base de dados ou usuário sem acesso!"
  };

  componentDidMount() {
    if (this.props.match.params.id_ordem) {
      this.fetchCurrentOrdem(this.props.match.params.id_ordem);
    }
  }

  fetchCurrentOrdem = (id) => {
    this.setState({loading: true}, () => {
      this.props.fetchOrdemEdicao(id)
      .then( () => {
        this.setState({loading: false});
      })
      .catch( (error) => {
        message.error(error);
        this.setState({found: false, errorMsg: error});
      });
    });
  }

  onAfterSave = (idOrdem) => {
    this.fetchCurrentOrdem(idOrdem);
  }

  render() {
    if (!this.state.found) {
      return (
        <InfoLabel type="error" showicon style={{marginLeft: '20px'}}>            
          {this.state.errorMsg}
        </InfoLabel>
      )
    }

    if (this.state.loading) {
      return <PageLoading />
    } else {
      return <OrdemForm 
              onAfterSave={this.onAfterSave} 
              idOrdem={this.props.match.params.id_ordem} 
              estado={this.props.estado}
            />
    }
  }
}

const mapStateToProps = state => {
  return {
    estado: state.ordemserv.ordemEdicao.dadosBasicos ? state.ordemserv.ordemEdicao.dadosBasicos.estado : 1
  }
}

export default connect(mapStateToProps, { 
  fetchOrdemEdicao
})(EditarOrdem);