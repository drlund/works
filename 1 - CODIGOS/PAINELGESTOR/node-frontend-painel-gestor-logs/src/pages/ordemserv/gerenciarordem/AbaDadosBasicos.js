import React, { Component } from 'react';
import InsNormativas from './insnormativa/InsNormativasComponent';
import ParticipanteComponent from './participante/ParticipanteComponent';
import DadosBasicos from './dadosbasicos/DadosBasicos';

class AbaDadosBasicos extends Component {
  render() {
    return (
      <div>
        <DadosBasicos onSavingData={this.props.onSavingData} />
        <InsNormativas />
        <ParticipanteComponent tipoParticipante="designante"/>
        <ParticipanteComponent tipoParticipante="designado"/>
      </div>
    )
  }
}

export default AbaDadosBasicos;