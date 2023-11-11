import React, { Component } from 'react'
import AssinarForm from './AssinarForm';

class RevogarOrdem extends Component {
  render() {
    return <AssinarForm tipoForm="revogar" idOrdem={this.props.match.params.id} 
              config={{
                mostrarDesignantes:true, 
                modoEdicaoDesignantes: false,
                mostrarDesignados:true,
                modoEdicaoDesignados: false
          }}/>
  }
}

export default RevogarOrdem;
