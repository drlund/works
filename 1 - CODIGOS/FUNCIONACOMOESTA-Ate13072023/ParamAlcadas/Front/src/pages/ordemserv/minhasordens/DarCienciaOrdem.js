import React, { Component } from 'react'
import AssinarForm from './AssinarForm';

class DarCienciaOrdem extends Component {
  render() {
    return <AssinarForm tipoForm="darCiencia" idOrdem={this.props.match.params.id} />
  }
}

export default DarCienciaOrdem;
