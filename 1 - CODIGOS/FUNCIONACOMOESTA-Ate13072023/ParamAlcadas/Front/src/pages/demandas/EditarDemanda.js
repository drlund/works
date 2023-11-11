import React, { Component } from 'react';
import PageLoading from 'components/pageloading/PageLoading';
import DemandasForm from 'pages/demandas/DemandasForm';
import InfoLabel from 'components/infolabel/InfoLabel';
import { connect } from 'react-redux';
import { fetchDemanda } from 'services/actions/demandas';
import { message } from 'antd';

class EditarDemanda extends Component {

  state = {       
    loading: true,
    found: true
  };

  componentDidMount() {
    this.props.fetchDemanda({
      idDemanda: this.props.match.params.id_demanda, 
      responseHandler: { 
        successCallback: this.onFetchedData,
        errorCallback: this.onFetchError
      },
      apenasColaborador: true
    });
  }

  onFetchedData = () => {
    this.setState({loading: false});
  }

  onFetchError = (errorMessage) => {
    if (errorMessage) {
      message.error(errorMessage);
    } else {
      message.error('Demanda não localizada!');
    }

    this.setState({found: false});
  }

  render() {
    if (!this.state.found) {
      return (
        <InfoLabel type="error" showicon style={{marginLeft: '20px'}}>
            Esta demanda não foi localizada na nossa base de dados!
        </InfoLabel>
      )
    }

    if (this.state.loading) {
      return( <PageLoading /> );
    } else {
      return (
        <span>
          <DemandasForm />
        </span>
      )
    }
  }
}

export default connect(null, {   
  fetchDemanda
})(EditarDemanda);

