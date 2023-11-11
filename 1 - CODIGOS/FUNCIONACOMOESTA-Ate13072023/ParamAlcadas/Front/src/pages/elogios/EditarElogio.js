import React, {Component} from 'react';
import { fetchElogio } from 'services/ducks/Elogios.ducks';
import { connect } from 'react-redux';
import ElogioForm from './ElogioForm';
import PageLoading from 'components/pageloading/PageLoading';
import InfoLabel from 'components/infolabel/InfoLabel';
import { message } from 'antd';

class EditarElogio extends Component{
  state = {
    loading: true,
    found: true
  };

  componentDidMount() {
    this.props.fetchElogio({
      idElogio: this.props.match.params.id, 
      responseHandler: { 
        successCallback: this.onFetchedData,
        errorCallback: this.onFetchError
      }
    });
  }

  onFetchedData = () => {
    this.setState({loading: false});
  }

  onFetchError = (errorMessage) => {
    if (errorMessage) {
      message.error(errorMessage);
    } else {
      message.error('Elogio não localizado!');
    }

    this.setState({found: false});
  }

  render() {
    if (!this.state.found) {
      return (
        <InfoLabel type="error" showicon style={{marginLeft: '20px'}}>
            As informações deste elogio não foram localizadas na nossa base de dados!
        </InfoLabel>
      )
    }

    if (this.props.dadosElogio.autorizado) {
      return (
        <InfoLabel type="error" showicon style={{marginLeft: '20px'}}>
            Não é possível editar um elogio com envio de e-mail já autorizado!
        </InfoLabel>
      )
    }

    if (this.state.loading) {
      return( <PageLoading /> );
    } else {
      return (
        <span>
          <ElogioForm />
        </span>
      )
    }
  }

}

const mapStateToProps = state => {
  return { dadosElogio: state.elogios.dadosElogio }
}

export default connect(mapStateToProps, { fetchElogio })(EditarElogio);