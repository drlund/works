import React from 'react';
import AdmDemandas from './AdmDemandas';
import PageLoading from '../../components/pageloading/PageLoading';

export class Demandas extends React.Component {
  state = {
    pageLoading: true
  }

  componentDidMount() {
    this.setState({
      pageLoading: false
    })
  }

  render = () => {

    if (this.state.pageLoading) {
      return (
        <PageLoading />
      );
    }

    return (
      <AdmDemandas />
    );
  }
};

export default Demandas;