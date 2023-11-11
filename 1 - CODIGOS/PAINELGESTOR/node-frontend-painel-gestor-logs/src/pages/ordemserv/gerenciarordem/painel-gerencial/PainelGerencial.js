import React, { Component } from 'react';
import OrdensGerenciar from './OrdensGerenciar';
import {removeMinhasOrdensData} from 'services/ducks/OrdemServ.ducks';
import { connect } from 'react-redux';

class PainelGerencial extends Component {

  constructor(props) {
    super(props);
    props.removeMinhasOrdensData();
  }

  render() {
    return <OrdensGerenciar />
  }
}

export default connect(null, {removeMinhasOrdensData})(PainelGerencial);