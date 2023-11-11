import React, { Component } from 'react';
import DemandasForm from './DemandasForm';
import { connect } from 'react-redux';
import {createDemanda} from 'services/actions/demandas';
import PageLoading from 'components/pageloading/PageLoading';

class NovaDemanda extends Component {
  state = {       
    loading: true
  };

  componentDidMount() {
    this.props.createDemanda(this.onClearData);
  }

  onClearData = () => {
    this.setState({loading: false});
  }

  render() {
    if(this.state.loading){
      return( <PageLoading /> );
    }else{
      return (
          <DemandasForm />
      )
    }
  }
}

export default connect(null, {
  createDemanda
})(NovaDemanda);
