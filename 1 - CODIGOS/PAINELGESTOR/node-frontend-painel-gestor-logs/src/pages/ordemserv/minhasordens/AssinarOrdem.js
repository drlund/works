import React, { Component } from 'react'
import AssinarForm from './AssinarForm';

class AssinarOrdem extends Component {
  render() {
    return <AssinarForm tipoForm="assinar" idOrdem={this.props.match.params.id} />
  }
}

export default AssinarOrdem;
